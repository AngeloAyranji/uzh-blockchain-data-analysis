import { PoolTotalCountResponse } from "./response/pool.total-count.response";

export const POOL_PROVIDER = 'POOL_PROVIDER';

export interface IPoolProvider {
    getTotalCount(chainId: number): Promise<PoolTotalCountResponse[]>;
}