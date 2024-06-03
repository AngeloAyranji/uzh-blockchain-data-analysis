import { Pool } from '../../../../../core/domains/analysis/pool';
import { VersionEnum } from '../../../../domains/analysis/factory';
import {
  PoolCountByDateResponse,
  PoolCountDateEnum,
} from './response/pool.count-by-date.response';
import { PoolTotalCountResponse } from './response/pool.total-count.response';

export const POOL_PROVIDER = 'POOL_PROVIDER';

export interface IPoolProvider {
  getTotalCount(chainId: number, version?: VersionEnum): Promise<any[]>;
  getTokensWithMostPools(
    chainId: number,
    version?: VersionEnum
  ): Promise<any[]>;
  getPoolCountByDate(
    chainId: number,
    dateEnum: PoolCountDateEnum,
    version: VersionEnum
  ): Promise<PoolCountByDateResponse[]>;
  getPoolsWithCursor(
    chainId: number,
    pageSize: number,
    lastId?: string,
  ): Promise<Pool[]>;
}
