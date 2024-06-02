import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import JSONdb from 'simple-json-db';
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

@Injectable()
export class ExtractProcessor implements IExtractProcessor {
  constructor(
    @InjectQueue('transform')
    private readonly transformQueue: Queue,

    @Inject(FACTORY_READ_SERVICE)
    private readonly factoryReadService: IFactoryReadService,

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
    Logger.log('Migration finished');
  }

  async extractPools(factories: Factory[]): Promise<void> {
    for (const factory of factories) {
      let moreLogs = true;
      const pageSize = 20;

      while (moreLogs) {
        const cursor = this.getCursor('pool');

        const logs = await this.logReadService.findLogsByTopic0AndAddress(
          factory.address,
          factory.poolCreatedSignature,
          pageSize,
          cursor?.lastTransactionHash,
          cursor?.lastLogIndex
        );
        console.log(logs.length);
        if (logs.length > 0) {
          // TODO: map logs to PairCreatedRequest
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
  }

  private getCursor(key: string): any {
    const cursorDb = new JSONdb('./apps/uniswap/json-db.json');
    return cursorDb.get(key);
  }

  private setCursor(key: string, value: any): void {
    const cursorDb = new JSONdb('./apps/uniswap/json-db.json');
    cursorDb.set(key, value);
  }

  private retreiveChainId(): number {
    const network = this.config.get<string>('NETWORK');

    switch (network) {
      case 'eth':
        return 1;
      case 'bsc':
        return 61;
      default:
        return 1;
    }
  }
}
