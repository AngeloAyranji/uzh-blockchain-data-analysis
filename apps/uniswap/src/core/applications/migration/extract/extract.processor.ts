import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import JSONdb from 'simple-json-db';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IExtractProcessor } from './iextract.processor';
import {
  FACTORY_READ_SERVICE,
  IFactoryReadService,
} from '../../analysis/factory/read/ifactory.read.service';
import {
  ILogReadService,
  LOG_READ_SERVICE,
} from '../../collection/log/read/ilog.read.service';
import { Factory } from '../../../domains/analysis/factory';
import {
  IPoolReadService,
  POOL_READ_SERVICE,
} from '../../analysis/pool/read/ipool.read.service';

@Injectable()
export class ExtractProcessor implements IExtractProcessor {
  private nextPhaseIntervalId: NodeJS.Timeout;

  constructor(
    @InjectQueue('transform')
    private readonly transformQueue: Queue,

    @InjectQueue('load')
    private readonly loadQueue: Queue,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    @Inject(FACTORY_READ_SERVICE)
    private readonly factoryReadService: IFactoryReadService,

    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(LOG_READ_SERVICE)
    private readonly logReadService: ILogReadService,

    private readonly config: ConfigService
  ) {
    this.startMigration();
  }

  async startMigration() {
    Logger.log('Migration started');
    const chainId = this.retreiveChainId();
    const factories = await this.factoryReadService.findAllByChainId(chainId);
    await this.extractPools(factories);
  }

  async handleNextExtraction(phase: string): Promise<void> {
    this.nextPhaseIntervalId = setInterval(async () => {
      const transformCount = await this.transformQueue.count();
      const loadCount = await this.loadQueue.count();
      if (transformCount === 0 && loadCount === 0) {
        if (phase === 'ACTIVITY') {
          const chainId = this.retreiveChainId();
          const factories = await this.factoryReadService.findAllByChainId(
            chainId
          );
          await this.extractActivity(factories);
        }
      }
    }, 15000);
  }

  async extractPools(factories: Factory[]): Promise<void> {
    Logger.log('Extracting Pools');
    for (const factory of factories) {
      let moreLogs = true;
      const pageSize = Number(this.config.get<string>('ACTIVITY_EXTRACT_BATCH_SIZE'));

      while (moreLogs) {
        const cursor = this.getCursor('pool');

        const logs = await this.logReadService.findLogsByTopic0AndAddress(
          factory.address,
          factory.poolCreatedSignature,
          pageSize,
          cursor?.lastTransactionHash,
          cursor?.lastLogIndex
        );

        if (logs.length > 0) {
          this.transformQueue.add(
            `POOL_CREATED_${factory.version}`,
            {
              logs: logs,
              factoryId: factory.id,
            },
            {
              removeOnComplete: true,
            }
          );

          const lastTransactionHash = logs[logs.length - 1].transactionHash;
          const lastLogIndex = logs[logs.length - 1].logIndex;
          this.setCursor('pool', {
            lastTransactionHash,
            lastLogIndex,
          });
        }

        moreLogs = logs.length === pageSize;
      }
    }
    Logger.log('Pools Extraction Finished');
    await this.handleNextExtraction('ACTIVITY');
  }

  async extractActivity(factories: Factory[]): Promise<void> {
    clearInterval(this.nextPhaseIntervalId);

    await this.cachePools(factories);

    Logger.log('Extracting Activity');

    for (const factory of factories) {
      let moreLogs = true;
      const pageSize = Number(this.config.get<string>('ACTIVITY_EXTRACT_BATCH_SIZE'));

      while (moreLogs) {
        const cursor = this.getCursor('activity');

        const logs = await this.logReadService.findLogsByManyTopic0(
          [factory.swapSignature, factory.mintSignature, factory.burnSignature],
          pageSize,
          cursor?.lastTransactionHash,
          cursor?.lastLogIndex
        );
        console.log(logs.length);
        if (logs.length > 0) {
          this.transformQueue.add(
            `ACTIVITY`,
            {
              logs: logs,
            },
            {
              removeOnComplete: true,
            }
          );

          const lastTransactionHash = logs[logs.length - 1].transactionHash;
          const lastLogIndex = logs[logs.length - 1].logIndex;

          this.setCursor('activity', {
            lastTransactionHash,
            lastLogIndex,
          });
        }

        moreLogs = logs.length === pageSize;
      }
    }

    Logger.log('Activity extraction finished');
  }

  private async cachePools(factories: Factory[]): Promise<void> {
    Logger.log('Caching pools');
    for (const factory of factories) {
      let morePools = true;
      const pageSize = Number(this.config.get<string>('ACTIVITY_EXTRACT_BATCH_SIZE'));
      let lastId = undefined;

      await this.cacheManager.reset();

      while (morePools) {
        const pools = await this.poolReadService.getPoolsWithCursor(
          factory.chainId,
          pageSize,
          lastId
        );
        console.log(pools.length);
        if (pools.length > 0) {
          for (const pool of pools) {
            this.cacheManager.set(pool.poolAddress, pool.id, 0);
          }

          lastId = pools[pools.length - 1].id;
        }

        morePools = pools.length === pageSize;
      }
    }
    Logger.log('Pools caching finished');
  }

  private getCursor(key: string): any {
    const path = `./apps/uniswap/${this.config.get<string>('NETWORK')}-db.json`;
    const cursorDb = new JSONdb(path);
    return cursorDb.get(key);
  }

  private setCursor(key: string, value: any): void {
    const path = `./apps/uniswap/${this.config.get<string>('NETWORK')}-db.json`;
    const cursorDb = new JSONdb(path);
    cursorDb.set(key, value);
  }

  private retreiveChainId(): number {
    const network = this.config.get<string>('NETWORK');

    switch (network) {
      case 'eth':
        return 1;
      case 'bsc':
        return 56;
      default:
        return 1;
    }
  }
}
