import { Inject, Injectable } from "@nestjs/common";
import { ITokenReadService } from "./itoken.read.service";
import { ITokenProvider, TOKEN_PROVIDER } from "./itoken.provider";
import { Token } from "../../../../domains/analysis/token";

@Injectable()
export class TokenReadService implements ITokenReadService {

    constructor(
        @Inject(TOKEN_PROVIDER)
        private readonly tokenProvider: ITokenProvider,
    ) {}

    async checkIfTokenExistsByChainIdAndAddress(chainId: number, address: string): Promise<boolean> {
        const tokenExists = await  this.tokenProvider.findTokenByChainIdAndAddress(chainId, address);
        
        return !!tokenExists;
    }

    async findByChainIdAndAddress(chainId: number, address: string): Promise<Token> {
        const token =  await this.tokenProvider.findTokenByChainIdAndAddress(chainId, address);

        if (!token) {
            throw new Error(`Token with address ${address} not found`);
        }

        return token;
    }
}