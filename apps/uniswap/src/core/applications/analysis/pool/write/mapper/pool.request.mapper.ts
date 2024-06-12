import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IPoolRequestMapper } from './ipool.request.mapper';
import { PoolAddRequest } from '../request/pool.add.request';
import { Pool } from '../../../../../domains/analysis/pool';

@Injectable()
export class PoolRequestMapper implements IPoolRequestMapper {
  mapAddRequestToDomain(request: PoolAddRequest): Pool {
    return {
      id: new uuidv4(),
      poolAddress: request.poolAddress,
      token0Id: request.token0Id,
      token1Id: request.token1Id,
      factoryId: request.factoryId,
      deployedAt: request.deployedAt,
    };
  }

  mapAddRequestsToDomains(requests: PoolAddRequest[]): Pool[] {
    return requests
      .map((request) => this.mapAddRequestToDomain(request))
      .flat();
  }
}
