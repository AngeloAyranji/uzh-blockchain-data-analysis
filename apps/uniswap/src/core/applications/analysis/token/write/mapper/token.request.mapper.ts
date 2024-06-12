import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { ITokenRequestMapper } from "./itoken.request.mapper";
import { TokenAddRequest } from "../request/token.add.request";
import { Token } from "../../../../../domains/analysis/token";

@Injectable()
export class TokenRequestMapper implements ITokenRequestMapper {
    mapAddRequestToDomain(request: TokenAddRequest): Token {
        return {
            id: new uuidv4(),
            address: request.address,
            name: request.name,
            symbol: request.symbol,
            decimals: request.decimals,
            chainId: request.chainId
        };
    }

    mapAddRequestsToDomains(requests: TokenAddRequest[]): Token[] {
        return requests.map(request => this.mapAddRequestToDomain(request));
    }
}