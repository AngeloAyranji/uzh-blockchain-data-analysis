
export const LIQUIDITY_PROVIDER = 'LIQUIDITY_PROVIDER';

export interface ILiquidityProvider {
    getTopActiveLiquidityProvidersByPool(
        chainId: number,
        poolAddress: string,
        limit?: number,
        startDate?: Date,
        endDate?: Date
    ): Promise<any>;
}