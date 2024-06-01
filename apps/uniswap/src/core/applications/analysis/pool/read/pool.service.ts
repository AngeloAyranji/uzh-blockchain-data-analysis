import { Inject, Injectable } from '@nestjs/common';
import { POOL_PROVIDER, IPoolProvider } from './ipool.provider';
import { IPoolReadService } from './ipool.read.service';
import { PoolTotalCountResponse } from './response/pool.total-count.response';
import {
  FACTORY_READ_SERVICE,
  IFactoryReadService,
} from '../../factory/read/ifactory.read.service';
import { VersionEnum } from '../../../../domains/analysis/factory';
import { PoolTokensWithMostPoolsResponse } from './response/pool.tokens-with-most-pools.response';
import { PoolCountDateEnum, PoolCountByDateResponse } from './response/pool.count-by-date.response';

@Injectable()
export class PoolReadService implements IPoolReadService {
  constructor(
    @Inject(POOL_PROVIDER)
    private readonly poolProvider: IPoolProvider,

    @Inject(FACTORY_READ_SERVICE)
    private readonly factoryReadService: IFactoryReadService
  ) {}

  async getTotalCount(
    chainId: number,
    version?: VersionEnum
  ): Promise<PoolTotalCountResponse[]> {
    const groupedPools = await this.poolProvider.getTotalCount(
      chainId,
      version
    );

    const populatedGroupedPools: PoolTotalCountResponse[] = await Promise.all(
      groupedPools.map(async (res) => {
        const factory =
          !version &&
          (await this.factoryReadService.findByAddress(res.factoryAddress));

        return {
          totalCount: res.totalCount,
          factoryAddress: res.factoryAddress,
          factoryVersion: version ? version : factory.version,
        };
      })
    );

    return populatedGroupedPools;
  }

  async getTokensWithMostPools(
    chainId: number,
    version?: VersionEnum
  ): Promise<PoolTokensWithMostPoolsResponse[]> {
    const tokensWithMostPools = await this.poolProvider.getTokensWithMostPools(
      chainId,
      version
    );
    const totalCount = await this.getTotalCount(chainId, version);

    return tokensWithMostPools.map((token) => {
      const total: number = version
        ? totalCount.find((count) => count.factoryVersion === version)
            .totalCount
        : totalCount.reduce((acc, count) => acc + count.totalCount, 0);

      return {
        token: token.token,
        count: token.count,
        percentage: token.count / total,
      };
    });
  }
  
  async getPoolCountByDate(chainId: number, dateEnum: PoolCountDateEnum, version: VersionEnum): Promise<PoolCountByDateResponse[]> {
      const result = await this.poolProvider.getPoolCountByDate(chainId, dateEnum, version);
      return result;
  }
}
