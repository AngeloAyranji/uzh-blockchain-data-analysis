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
import {
  PoolCountDateEnum,
  PoolCountByDateResponse,
} from './response/pool.count-by-date.response';
import { Pool } from '../../../../../core/domains/analysis/pool';

@Injectable()
export class PoolReadService implements IPoolReadService {
  constructor(
    @Inject(POOL_PROVIDER)
    private readonly poolProvider: IPoolProvider,

    @Inject(FACTORY_READ_SERVICE)
    private readonly factoryReadService: IFactoryReadService
  ) {}
  
  async getPoolsWithCursor(chainId: number, pageSize: number, lastId?: string): Promise<Pool[]> {
      return this.poolProvider.getPoolsWithCursor(chainId, pageSize, lastId);
  }

  async checkIfPoolIsVersion(chainId: number, poolAddress: string, version: VersionEnum): Promise<boolean> {
    const pool = await this.poolProvider.getPoolByChainIdAddressAndVersion(chainId, poolAddress, version);
    return !!pool;
  }

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
          (await this.factoryReadService.findById(
            res.factoryId
          ));

        return {
          totalCount: res.totalCount,
          factoryAddress: factory.address,
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

  async getPoolCountByDate(
    chainId: number,
    dateEnum: PoolCountDateEnum,
    version: VersionEnum
  ): Promise<PoolCountByDateResponse[]> {
    const result = await this.poolProvider.getPoolCountByDate(
      chainId,
      dateEnum,
      version
    );
    return result;
  }
}
