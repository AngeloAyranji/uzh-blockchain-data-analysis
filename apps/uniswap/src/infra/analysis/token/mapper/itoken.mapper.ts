import { Token } from "../../../../core/domains/analysis/token";
import { TokenEntity } from "../token.entity";

export const TOKEN_MAPPER = "TOKEN_MAPPER";

export interface ITokenMapper {
    mapEntityToDomain(entity: TokenEntity): Token;
    mapDomainToEntity(domain: Token): TokenEntity;
}