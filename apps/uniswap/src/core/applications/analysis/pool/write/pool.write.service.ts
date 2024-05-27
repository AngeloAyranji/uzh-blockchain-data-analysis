import { Inject, Injectable } from '@nestjs/common';
import { IPoolWriteService } from './ipool.write.service';
import { IPoolModifier, POOL_MODIFIER } from './ipool.modifier';
import {
  IPoolRequestMapper,
  POOL_REQUEST_MAPPER,
} from './mapper/ipool.request.mapper';
import { PoolAddRequest } from './request/pool.add.request';

@Injectable()
export class PoolWriteService implements IPoolWriteService {
  constructor(
    @Inject(POOL_MODIFIER)
    private readonly poolModifier: IPoolModifier,

    @Inject(POOL_REQUEST_MAPPER)
    private readonly poolRequestMapper: IPoolRequestMapper
  ) {}

  async addMany(requests: PoolAddRequest[]): Promise<void> {
    const pools = this.poolRequestMapper.mapAddRequestsToDomains(requests);
    await this.poolModifier.createMany(pools);
  }
}
