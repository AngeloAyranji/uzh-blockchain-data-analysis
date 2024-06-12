import { Injectable } from "@nestjs/common";
import { ITokenMapper } from "./itoken.mapper";
import { Token } from "../../../../core/domains/analysis/token";
import { TokenEntity } from "../token.entity";

@Injectable()
export class TokenMapper implements ITokenMapper {
    mapDomainToEntity(domain: Token): TokenEntity {
        return {
            id: domain.id,
            address: domain.address,
            name: domain.name,
            symbol: domain.symbol,
            decimals: domain.decimals,
            chainId: domain.chainId
        };
    }

    mapEntityToDomain(entity: TokenEntity): Token {
        return {
            id: entity.id,
            address: entity.address,
            name: entity.name,
            symbol: entity.symbol,
            decimals: entity.decimals,
            chainId: entity.chainId
        };
    }
}