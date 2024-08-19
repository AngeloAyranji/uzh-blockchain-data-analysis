import { LiquidityTypeEnum } from "../../../../../core/domains/analysis/liquidity";

export const LIQUIDITY_PROVIDER = 'LIQUIDITY_PROVIDER';

export interface ILiquidityProvider {
    getTopActiveLiquidityProvidersByPool(
        chainId: number,
        poolAddress: string,
        limit?: number,
        startDate?: Date,
        endDate?: Date
    ): Promise<any>;
    getPoolFlow(
        chainId: number,
        poolAddress: string,
        liquidityType: LiquidityTypeEnum,
        startDate?: Date,
        endDate?: Date
      )
}