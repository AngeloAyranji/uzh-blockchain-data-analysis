import { VersionEnum } from '../../../../domains/analysis/factory';
import {
  PoolCountByDateResponse,
  PoolCountDateEnum,
} from './response/pool.count-by-date.response';
import { PoolTokensWithMostPoolsResponse } from './response/pool.tokens-with-most-pools.response';
import { PoolTotalCountResponse } from './response/pool.total-count.response';

export const POOL_READ_SERVICE = 'POOL_READ_SERVICE';

export interface IPoolReadService {
  getTotalCount(
    chainId: number,
    version?: VersionEnum
  ): Promise<PoolTotalCountResponse[]>;
  getTokensWithMostPools(
    chainId: number,
    version?: VersionEnum
  ): Promise<PoolTokensWithMostPoolsResponse[]>;
  getPoolCountByDate(
    chainId: number,
    dateEnum: PoolCountDateEnum,
    version: VersionEnum
  ): Promise<PoolCountByDateResponse[]>;
}
