import { Injectable } from '@nestjs/common';
import { ILogMapper } from './ilog.mapper';
import { LogEntity } from '../log.entity';
import { Log } from '../../../core/domains/collection/log';

@Injectable()
export class LogMapper implements ILogMapper {
  mapEntityToDomain(entity: LogEntity): Log {
    const domain: Log = {
      transactionHash: entity.transaction_hash,
      logIndex: entity.log_index,
      address: entity.address,
      topic0: entity.topic_0,
      topics: entity.topics,
      data: entity.data,
      timestamp: entity.block_timestamp,
    };
    return domain;
  }

  mapEntitiesToDomains(entities: LogEntity[]): Log[] {
    return entities.map((entity) => this.mapEntityToDomain(entity));
  }
}
