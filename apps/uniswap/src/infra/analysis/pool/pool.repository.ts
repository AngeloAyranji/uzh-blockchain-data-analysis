import { Inject, Injectable } from '@nestjs/common';
import { POOL_MAPPER, IPoolMapper } from './mapper/ipool.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Pool } from '../../../core/domains/analysis/pool';
import { IPoolModifier } from '../../../core/applications/analysis/pool/write/ipool.modifier';
import { IPoolProvider } from '../../../core/applications/analysis/pool/read/ipool.provider';
import { VersionEnum } from '../../../core/domains/analysis/factory';
import {
  PoolCountDateEnum,
  PoolCountByDateResponse,
} from '../../../core/applications/analysis/pool/read/response/pool.count-by-date.response';

@Injectable()
export class PoolRepository implements IPoolModifier, IPoolProvider {
  constructor(
    @Inject(POOL_MAPPER)
    private readonly poolMapper: IPoolMapper,
    private readonly uniswapDbHandler: UniswapDbHandler
  ) { }

  async createMany(pools: Pool[]): Promise<void> {
    const entities = this.poolMapper.mapDomainsToEntities(pools);
    await this.uniswapDbHandler.pool.createMany({
      data: entities,
    });
  }

  async getPoolByChainIdAddressAndVersion(chainId: number, poolAddress: string, version: VersionEnum): Promise<Pool> {
    const pool = await this.uniswapDbHandler.pool.findFirst({
      where: {
        factory: {
          chainId: chainId,
          version: version,
        },
        poolAddress: poolAddress,
      },
    });

    if (!pool) {
      return null;
    }

    return this.poolMapper.mapEntityToDomain(pool);
  }

  async getPoolsWithCursor(
    chainId: number,
    pageSize: number,
    lastId?: string
  ): Promise<Pool[]> {
    const pools = await this.uniswapDbHandler.pool.findMany({
      take: pageSize,
      skip: lastId ? 1 : 0,
      cursor: lastId && {
        id: lastId,
      },
      where: {
        factory: {
          chainId: chainId,
        },
      },
    });
    return this.poolMapper.mapEntitiesToDomains(pools);
  }

  async getTotalCount(chainId: number, version?: VersionEnum): Promise<any> {
    const groupedPools = await this.uniswapDbHandler.pool.groupBy({
      where: {
        factory: {
          chainId: chainId,
          version: version,
        },
      },
      by: ['factoryId'],
      _count: {
        _all: true,
      },
    });

    return groupedPools.map((groupedPool) => {
      return {
        factoryId: groupedPool.factoryId,
        totalCount: groupedPool._count._all,
      };
    });
  }

  async getTokensWithMostPools(
    chainId: number,
    version?: VersionEnum
  ): Promise<any[]> {
    // Aggregate pools where the token appears as token0
    const token0Counts = await this.uniswapDbHandler.pool.groupBy({
      by: ['token0'],
      _count: {
        token0: true,
      },
      where: {
        factory: {
          chainId: chainId,
          version: version,
        },
      },
    });

    // Aggregate pools where the token appears as token1
    const token1Counts = await this.uniswapDbHandler.pool.groupBy({
      by: ['token1'],
      _count: {
        token1: true,
      },
      where: {
        factory: {
          chainId: chainId,
          version: version,
        },
      },
    });

    // Combine both counts into a single list
    const combinedCounts: { [token: string]: number } = {};
    token0Counts.forEach((item) => {
      combinedCounts[item.token0] =
        (combinedCounts[item.token0] || 0) + item._count.token0;
    });
    token1Counts.forEach((item) => {
      combinedCounts[item.token1] =
        (combinedCounts[item.token1] || 0) + item._count.token1;
    });

    // Convert the combined counts object to an array and sort by count
    const sortedTokens = Object.entries(combinedCounts)
      .map(([token, count]) => ({ token, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return sortedTokens;
  }

  async getPoolCountByDate(
    chainId: number,
    dateEnum: PoolCountDateEnum,
    version: VersionEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<PoolCountByDateResponse[]> {
    const query = `
      SELECT 
        DATE_TRUNC('${dateEnum}', "deployedAt") AS date, 
        "Factory"."version" AS version, 
        COUNT(*) AS totalCount 
      FROM "Pool"
      JOIN "Factory" ON "Pool"."factoryId" = "Factory"."id"
      WHERE "Factory"."chainId" = ${chainId}
        ${startDate ? `AND "Pool"."deployedAt" >= '${startDate}'` : ''}
        ${endDate ? `AND "Pool"."deployedAt" <= '${endDate}'` : ''}
      GROUP BY date, "Factory"."version"
      ORDER BY date ASC, "Factory"."version"`;

    const counts: any[] = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return this.poolMapper.mapPoolCountByDateToPoolCountByDateResponse(
      counts,
      version,
      chainId,
      dateEnum
    );
  }

  async getTokensOfPool(chainId: number, poolAddress: string): Promise<string[]> {
    const pool = await this.uniswapDbHandler.pool.findFirst({
      where: {
        factory: {
          chainId: chainId,
        },
        poolAddress: poolAddress,
      },
    });

    return [pool.token0, pool.token1];
  }
}
