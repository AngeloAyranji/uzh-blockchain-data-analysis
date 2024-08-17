
export const LIQUIDITY_READ_SERVICE = 'LIQUIDITY_READ_SERVICE';

export interface ILiquidityReadService {
    getTopActiveLiquidityProvidersByPool(
        chainId: number,
        poolAddress: string,
        limit?: number,
        startDate?: Date,
        endDate?: Date
    ): Promise<any>;
}