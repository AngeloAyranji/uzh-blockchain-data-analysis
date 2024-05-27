import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IExtractProcessor } from './iextract.processor';
import {
  FACTORY_READ_SERVICE,
  IFactoryReadService,
} from '../../analysis/factory/read/ifactory.read.service';
import { ILogReadService, LOG_READ_SERVICE } from '../../collection/log/read/ilog.read.service';
import { Log } from '../../../domains/collection/log';

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
    const chainId = this.retreiveChainId();
    const factories = await this.factoryReadService.findAllByChainId(chainId);

    for (const factory of factories) {
      const totalCount = await this.logReadService.findTotalCountByTopic0AndAddress(factory.address, factory.poolCreatedSignature);
      const count = 0;

      // while (count < totalCount) {
      //   const logs = await this.logReadService.findLogsByTopic0AndAddress(factory.swapSignature, factory.address);
      //   count += logs.length;

      //   await this.transformQueue.add('SWAP', logs, { removeOnComplete: true });

      // }
    }
  }

  async extractAndTransformLogs(topic0: string, factoryAddress: string): Promise<void> {
    const logs = await this.logReadService.findLogsByTopic0AndAddress(topic0, factoryAddress);

    await this.transformQueue.add('POOL_CREATED', logs, { removeOnComplete: true });
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
