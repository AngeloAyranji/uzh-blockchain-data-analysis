import { PoolAddRequest } from "./request/pool.add.request";

export const POOL_WRITE_SERVICE = 'POOL_WRITE_SERVICE';

export interface IPoolWriteService {
    addMany(pools: PoolAddRequest[]): Promise<void>;
}