import { PoolTokensWithMostPoolsResponse } from "../../../../core/applications/analysis/pool/read/response/pool.tokens-with-most-pools.response";
import { PoolTotalCountResponse } from "../../../../core/applications/analysis/pool/read/response/pool.total-count.response";
import { PoolTotalCountApiResponse } from "../dto/pool.get-total-count.api.response";
import { PoolTokensWithMostPoolsApiResponse } from "../dto/pool.get-most-tokens-pools.api.response";
import { PoolCountByDateResponse } from "../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response";
import { PoolCountByDateApiResponse } from "../dto/pool.count-by-date.api.response";

export const POOL_CONTROLLER_READ_MAPPER = 'POOL_CONTROLLER_READ_MAPPER';

export interface IPoolControllerReadMapper {
    mapTotalCountToTotalCountApiResponse(response: PoolTotalCountResponse[]): PoolTotalCountApiResponse[];
    mapTokensMostPoolsToTokensMostPoolsApiResponse(response: PoolTokensWithMostPoolsResponse[]): PoolTokensWithMostPoolsApiResponse[];
    mapPoolCountByDateToPoolCountByDateApiResponse(response: PoolCountByDateResponse[]): PoolCountByDateApiResponse[];
}