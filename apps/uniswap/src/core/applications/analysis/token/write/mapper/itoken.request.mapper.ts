import { Token } from "../../../../../domains/analysis/token";
import { TokenAddRequest } from "../request/token.add.request";

export const TOKEN_REQUEST_MAPPER = "TOKEN_REQUEST_MAPPER";

export interface ITokenRequestMapper {
    mapAddRequestToDomain(request: TokenAddRequest): Token;
    mapAddRequestsToDomains(requests: TokenAddRequest[]): Token[];
}