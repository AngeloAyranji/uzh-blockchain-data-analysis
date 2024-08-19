import { Inject, Injectable } from '@nestjs/common';
import { CollectionDbHandler } from '@uzh/collection-db';
import { Log } from '../../../core/domains/collection/log';
import { ILogMapper, LOG_MAPPER } from './mapper/ilog.mapper';
import { ILogProvider } from '../../../core/applications/collection/log/read/ilog.provider';
import { LogEntity } from './log.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogRepository implements ILogProvider {
  constructor(
    @Inject(LOG_MAPPER)
    private readonly logMapper: ILogMapper,

    private readonly config: ConfigService,

    private readonly collectionDbHandler: CollectionDbHandler
  ) { }

  async findLogsByTopic0AndAddress(
    address: string,
    topic0: string,
    pageSize = 50,
    lastTransactionHash?: string,
    lastLogIndex?: number
  ): Promise<Log[]> {
    let query = `
        SELECT * FROM "${this.getViewNameByNetwork()}"
        WHERE "address" = '${address}' AND "topic_0" = '${topic0}' 
    `;

    if (lastTransactionHash && lastLogIndex) {
      query += ` AND ("transaction_hash", "log_index") > ('${lastTransactionHash}', ${lastLogIndex})`;
    }

    query += ` ORDER BY "transaction_hash", "log_index" ASC
               LIMIT ${pageSize}`;

    const logs: LogEntity[] = await this.collectionDbHandler.$queryRawUnsafe(query);
    return this.logMapper.mapEntitiesToDomains(logs);
  }

  async findTotalCountByTopic0AndAddress(
    address: string,
    topic0: string
  ): Promise<number> {
    const query = `SELECT COUNT(*) FROM "${this.getViewNameByNetwork()}" WHERE address = ${address} AND topic_0 = ${topic0}`;
    const result = await this.collectionDbHandler
      .$queryRawUnsafe(query);

    return Number(result[0].count);
  }

  async findLogsByTopic0(
    topic0: string,
    pageSize = 50,
    lastTransactionHash?: string,
    lastLogIndex?: number
  ): Promise<Log[]> {
    let query = `
        SELECT * FROM "${this.getViewNameByNetwork()}"
        WHERE "topic_0" = '${topic0}'
    `;

    if (lastTransactionHash && lastLogIndex) {
      query += ` AND ("transaction_hash", "log_index") > ('${lastTransactionHash}', ${lastLogIndex})`;
    }

    query += ` ORDER BY "transaction_hash", "log_index" ASC
               LIMIT ${pageSize}`;

    const logs: LogEntity[] = await this.collectionDbHandler.$queryRawUnsafe(query);
    return this.logMapper.mapEntitiesToDomains(logs);
  }

  async findLogsByManyTopic0(
    topic0s: string[],
    pageSize = 50,
    lastTransactionHash?: string,
    lastLogIndex?: number
  ): Promise<Log[]> {
    let query = `
        SELECT * FROM "${this.getViewNameByNetwork()}"
        WHERE "topic_0" IN (${topic0s.map(topic0 => `'${topic0}'`).join(', ')})
    `;

    if (lastTransactionHash && lastLogIndex) {
      query += ` AND ("transaction_hash", "log_index") > ('${lastTransactionHash}', ${lastLogIndex})`;
    }

    query += ` ORDER BY "transaction_hash", "log_index" ASC
               LIMIT ${pageSize}`;

    const logs: LogEntity[] = await this.collectionDbHandler.$queryRawUnsafe(query);
    return this.logMapper.mapEntitiesToDomains(logs);
  }

  private getViewNameByNetwork(): string {
    const network = this.config.get<string>('NETWORK');
    return network === 'bsc' ? 'bsc_transaction_logs_with_timestamp' : 'eth_transaction_logs_with_timestamp';
  }
}
