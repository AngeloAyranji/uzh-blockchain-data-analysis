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
import { IUniswapContractExternalService, UNISWAP_CONTRACT_EXTERNAL_SERVICE } from '../../../../../external/uniswap-contract/iuniswap-contract.external.service';

@Injectable()
export class PoolReadService implements IPoolReadService {
  constructor(
    @Inject(POOL_PROVIDER)
    private readonly poolProvider: IPoolProvider,

    @Inject(FACTORY_READ_SERVICE)
    private readonly factoryReadService: IFactoryReadService,

    @Inject(UNISWAP_CONTRACT_EXTERNAL_SERVICE)
    private readonly UniswapContractExternalService: IUniswapContractExternalService,
  ) {}

  async getTokensOfPool(
    chainId: number,
    poolAddress: string
  ): Promise<string[]> {
    const tokens = await this.poolProvider.getTokensOfPool(chainId, poolAddress);

    if (tokens.length === 0) {
      throw new Error('No tokens found for pool');
    }

    return tokens;
  }
  
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

    const tokensWithSymbols = await Promise.all(tokensWithMostPools.map(async (token) => {
        const symbol = await this.UniswapContractExternalService.getSymbol(token.token);
        const total: number = version
            ? totalCount.find((count) => count.factoryVersion === version)?.totalCount || 0
            : totalCount.reduce((acc, count) => acc + count.totalCount, 0);

        return {
            symbol: symbol,
            token: token.token,
            count: token.count,
            percentage: token.count / total,
        };
    }));

    return tokensWithSymbols;
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
