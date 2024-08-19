import { LiquidityTypeEnum } from "../../../../domains/analysis/liquidity";

export const LIQUIDITY_READ_SERVICE = 'LIQUIDITY_READ_SERVICE';

export interface ILiquidityReadService {
    getTopActiveLiquidityProvidersByPool(
        chainId: number,
        poolAddress: string,
        limit?: number,
        startDate?: Date,
        endDate?: Date
    ): Promise<any>;
    getPoolflow(
        chainId: number,
        poolAddress: string,
        type: LiquidityTypeEnum,
        startDate?: Date,
        endDate?: Date
    ): Promise<any[]>;
    getPoolTotalFlow(
        chainId: number,
        poolAddress: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<any[]>;
}