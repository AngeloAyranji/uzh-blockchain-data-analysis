import { VersionEnum } from "../../../../domains/analysis/factory";
import { PoolTotalCountResponse } from "./response/pool.total-count.response";

export const POOL_PROVIDER = 'POOL_PROVIDER';

export interface IPoolProvider {
    getTotalCount(chainId: number, version?: VersionEnum): Promise<PoolTotalCountResponse[]>;
    getTokensWithMostPools(chainId: number, version?: VersionEnum): Promise<any[]>;
}