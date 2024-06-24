export const UNISWAP_CONTRACT_EXTERNAL_SERVICE = 'UNISWAP_CONTRACT_EXTERNAL_SERVICE';

export interface IUniswapContractExternalService {
    getSymbol(address: string): Promise<string>;
    getPoolTokens(address: string): Promise<{
        token0: string,
        token1: string
    }>;
    getDecimalsAndSymbol(address: string): Promise<{ decimals: number; symbol: string; }>
};