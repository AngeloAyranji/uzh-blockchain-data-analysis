import { Token } from "../../../../../core/domains/analysis/token";

export const TOKEN_PROVIDER = "TOKEN_PROVIDER";

export interface ITokenProvider {
    findTokenByChainIdAndAddress(chainId: number, address: string): Promise<Token>;
}