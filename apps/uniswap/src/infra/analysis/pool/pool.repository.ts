import { Inject, Injectable } from '@nestjs/common';
import { POOL_MAPPER, IPoolMapper } from './mapper/ipool.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Pool } from '../../../core/domains/analysis/pool';
import { IPoolModifier } from '../../../core/applications/analysis/pool/write/ipool.modifier';

@Injectable()
export class PoolRepository implements IPoolModifier {
    constructor(
        @Inject(POOL_MAPPER)
        private readonly poolMapper: IPoolMapper,
        private readonly uniswapDbHandler: UniswapDbHandler,
      ) {}

      async createMany(pools: Pool[]): Promise<void> {
        const entities = this.poolMapper.mapDomainsToEntities(pools);
        await this.uniswapDbHandler.pool.createMany({
            data: entities
        });
      }
}