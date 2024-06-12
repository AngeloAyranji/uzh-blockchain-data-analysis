import { Inject, Injectable } from "@nestjs/common";
import { ITokenModifier } from "../../../core/applications/analysis/token/write/itoken.modifier.service";
import { ITokenMapper, TOKEN_MAPPER } from "./mapper/itoken.mapper";
import { UniswapDbHandler } from "../../db/uniswap-db.handler";
import { Token } from "../../../core/domains/analysis/token";
import { ITokenProvider } from "apps/uniswap/src/core/applications/analysis/token/read/itoken.provider";

@Injectable()
export class TokenRepository implements ITokenModifier, ITokenProvider {
    constructor(
        @Inject(TOKEN_MAPPER)
        private readonly tokenMapper: ITokenMapper,
        private readonly uniswapDbHandler: UniswapDbHandler
    ) { }

    async add(token: Token): Promise<void> {
        const entity = this.tokenMapper.mapDomainToEntity(token);
        await this.uniswapDbHandler.token.create({
            data: entity
        });
    }

    async findTokenByChainIdAndAddress(chainId: number, address: string): Promise<Token> {
        const token = await this.uniswapDbHandler.token.findUnique({
            where: {
                unique_chain_id_address: {
                    chainId: chainId,
                    address: address
                }
            }
        });

        if (!token) {
            return null;
        }

        return this.tokenMapper.mapEntityToDomain(token);
    }
}