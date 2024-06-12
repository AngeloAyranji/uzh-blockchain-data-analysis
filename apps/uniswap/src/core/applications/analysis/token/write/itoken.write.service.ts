import { TokenAddRequest } from "./request/token.add.request";

export const TOKEN_WRITE_SERVICE = 'TOKEN_WRITE_SERVICE';

export interface ITokenWriteService {
    add(token: TokenAddRequest): Promise<void>;
}