import { PoolTotalCountResponse } from "./response/pool.total-count.response";

export const POOL_READ_SERVICE = 'POOL_READ_SERVICE';

export interface IPoolReadService {
    getTotalCount(chainId: number): Promise<PoolTotalCountResponse[]>;
}