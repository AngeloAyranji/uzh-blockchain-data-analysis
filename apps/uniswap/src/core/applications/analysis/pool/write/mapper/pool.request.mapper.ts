import { Injectable } from '@nestjs/common';
import { IPoolRequestMapper } from './ipool.request.mapper';
import { PoolAddRequest } from '../request/pool.add.request';
import { Pool } from '../../../../../domains/analysis/pool';

@Injectable()
export class PoolRequestMapper implements IPoolRequestMapper {
  mapAddRequestToDomain(request: PoolAddRequest): Pool {
    return {
      poolAddress: request.poolAddress,
      token0: request.token0,
      token1: request.token1,
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
