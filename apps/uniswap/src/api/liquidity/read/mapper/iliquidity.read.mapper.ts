import { LiquidityGetActiveProvidersByPoolApiResponse } from "../dto/liquidity.get-active-providers-by-pool.api.response";

export const LIQUIDITY_CONTROLLER_READ_MAPPER = 'LIQUIDITY_CONTROLLER_READ_MAPPER';

export interface ILiquidityControllerReadMapper {
    mapActiveProvidersByPoolToApiResponse(activeProvidersByPool: any[]): LiquidityGetActiveProvidersByPoolApiResponse[];
}