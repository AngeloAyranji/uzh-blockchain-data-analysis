import { Inject, Injectable } from '@nestjs/common';
import { POOL_MAPPER, IPoolMapper } from './mapper/ipool.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Pool } from '../../../core/domains/analysis/pool';
import { IPoolModifier } from '../../../core/applications/analysis/pool/write/ipool.modifier';
import { IPoolProvider } from '../../../core/applications/analysis/pool/read/ipool.provider';
import { PoolTotalCountResponse } from '../../../core/applications/analysis/pool/read/response/pool.total-count.response';

@Injectable()
export class PoolRepository implements IPoolModifier, IPoolProvider {
  constructor(
    @Inject(POOL_MAPPER)
    private readonly poolMapper: IPoolMapper,
    private readonly uniswapDbHandler: UniswapDbHandler
  ) {}

  async createMany(pools: Pool[]): Promise<void> {
    const entities = this.poolMapper.mapDomainsToEntities(pools);
    await this.uniswapDbHandler.pool.createMany({
      data: entities,
    });
  }

  async getTotalCount(chainId: number): Promise<any> {
    const groupedPools = await this.uniswapDbHandler.pool.groupBy({
      where: {
        factory: {
          chainId: chainId,
        }
      },
      by: ['factoryAddress'],
      _count: {
        _all: true,
      }
    });
    
    return groupedPools.map((groupedPool) => {
      return {
        factoryAddress: groupedPool.factoryAddress,
        totalCount: groupedPool._count._all,
      };
    });
  }
}
