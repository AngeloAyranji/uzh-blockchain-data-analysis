import { LiquidityGetActiveProvidersByPoolApiResponse } from "../dto/liquidity.get-active-providers-by-pool.api.response";
import { LiquidityGetPoolFlowApiResponse } from "../dto/liquidity.get-pool-flow.api.response";
import { LiquidityGetTotaltPoolFlowApiResponse } from "../dto/liquidity.get-total-pool-flow.api.response";

export const LIQUIDITY_CONTROLLER_READ_MAPPER = 'LIQUIDITY_CONTROLLER_READ_MAPPER';

export interface ILiquidityControllerReadMapper {
    mapActiveProvidersByPoolToApiResponse(activeProvidersByPool: any[]): LiquidityGetActiveProvidersByPoolApiResponse[];
    mapPoolFlowToApiResponse(poolFlow: any[]): LiquidityGetPoolFlowApiResponse[];
    mapTotalPoolFlowToApiResponse(totalPoolFlow: any[]): LiquidityGetTotaltPoolFlowApiResponse[];
}