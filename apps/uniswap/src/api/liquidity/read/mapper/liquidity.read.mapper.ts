import { Injectable } from "@nestjs/common";
import { ILiquidityControllerReadMapper } from "./iliquidity.read.mapper";
import { LiquidityGetActiveProvidersByPoolApiResponse } from "../dto/liquidity.get-active-providers-by-pool.api.response";
import { LiquidityGetPoolFlowApiResponse } from "../dto/liquidity.get-pool-flow.api.response";
import { LiquidityGetTotaltPoolFlowApiResponse } from "../dto/liquidity.get-total-pool-flow.api.response";

@Injectable()
export class LiquidityControllerReadMapper implements ILiquidityControllerReadMapper {
    mapActiveProvidersByPoolToApiResponse(activeProvidersByPool: any[]): LiquidityGetActiveProvidersByPoolApiResponse[] {
        return activeProvidersByPool.map((activeProviderByPool) => {
            return {
                address: activeProviderByPool.address,
                count: activeProviderByPool.count,
                percentage: activeProviderByPool.percentage,
            };
        });
    }

    mapPoolFlowToApiResponse(poolFlow: any[]): LiquidityGetPoolFlowApiResponse[] {
        return poolFlow.map((flow) => {
            return {
                date: flow.date,
                amount0: flow.amount0,
                amount1: flow.amount1,
            };
        });
    }

    mapTotalPoolFlowToApiResponse(totalPoolFlow: any[]): LiquidityGetTotaltPoolFlowApiResponse[] {
        return totalPoolFlow.map((flow) => {
            return {
                date: flow.date,
                amount0: flow.amount0,
                amount1: flow.amount1,
            };
        });
    }
}