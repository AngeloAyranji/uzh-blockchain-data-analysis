import { PoolTotalCountResponse } from "../../../../core/applications/analysis/pool/read/response/pool.total-count.response";
import { PoolTotalCountApiResponse } from "../dto/pool.get-total-count.api.response";

export const POOL_CONTROLLER_READ_MAPPER = 'POOL_CONTROLLER_READ_MAPPER';

export interface IPoolControllerReadMapper {
    mapTotalCountToToalCountApiResponse(response: PoolTotalCountResponse[]): PoolTotalCountApiResponse[];
}