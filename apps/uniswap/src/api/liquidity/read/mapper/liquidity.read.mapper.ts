import { Injectable } from "@nestjs/common";
import { ILiquidityControllerReadMapper } from "./iliquidity.read.mapper";
import { LiquidityGetActiveProvidersByPoolApiResponse } from "../dto/liquidity.get-active-providers-by-pool.api.response";

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

}