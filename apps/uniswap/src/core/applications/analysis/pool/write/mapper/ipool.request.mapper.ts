import { Pool } from "../../../../../domains/analysis/pool";
import { PoolAddRequest } from "../request/pool.add.request";

export const POOL_REQUEST_MAPPER = 'POOL_REQUEST_MAPPER';

export interface IPoolRequestMapper {
    mapAddRequestToDomain(request: PoolAddRequest): Pool;
    mapAddRequestsToDomains(requests: PoolAddRequest[]): Pool[];
}