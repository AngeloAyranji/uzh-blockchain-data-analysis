import { Inject, Injectable } from "@nestjs/common";
import { ITokenWriteService } from "./itoken.write.service";
import { ITokenModifier, TOKEN_MODIFIER } from "./itoken.modifier.service";
import { TokenAddRequest } from "./request/token.add.request";
import { ITokenRequestMapper, TOKEN_REQUEST_MAPPER } from "./mapper/itoken.request.mapper";

@Injectable()
export class TokenWriteService implements ITokenWriteService {
    constructor(
        @Inject(TOKEN_MODIFIER)
        private readonly tokenModifier: ITokenModifier,

        @Inject(TOKEN_REQUEST_MAPPER)
        private readonly tokenRequestMapper: ITokenRequestMapper
    ) { }

    async add(token: TokenAddRequest): Promise<void> {
        await this.tokenModifier.add(this.tokenRequestMapper.mapAddRequestToDomain(token));
    }
}