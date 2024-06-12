import { Token } from "../../../../domains/analysis/token";

export const TOKEN_READ_SERVICE = "TOKEN_READ_SERVICE";

export interface ITokenReadService {
    checkIfTokenExistsByChainIdAndAddress(chainId: number, address: string): Promise<boolean>;
    findByChainIdAndAddress(chainId: number, address: string): Promise<Token>
}