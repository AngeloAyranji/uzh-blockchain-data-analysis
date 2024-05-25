import { Inject, Injectable } from '@nestjs/common';
import { CollectionDbHandler } from '@uzh/collection-db';
import { Log } from '../../../core/domains/collection/log';
import { ILogMapper, LOG_MAPPER } from './mapper/ilog.mapper';
import { ILogProvider } from '../../../core/applications/collection/log/read/ilog.provider';

@Injectable()
export class LogRepository implements ILogProvider {
  constructor(
    @Inject(LOG_MAPPER)
    private readonly logMapper: ILogMapper,

    private readonly collectionDbHandler: CollectionDbHandler
  ) {}

  async findLogsByTopic0AndAddress(address: string, topic0: string): Promise<Log[]> {
    const logs = await this.collectionDbHandler.eth_transaction_logs.findMany({
        where: {
            address: address,
            topic_0: topic0
        }
    });
    return this.logMapper.mapEntitiesToDomains(logs);
  }
}   