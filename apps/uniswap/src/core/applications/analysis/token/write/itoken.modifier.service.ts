import { Token } from "../../../../domains/analysis/token";

export const TOKEN_MODIFIER = 'TOKEN_MODIFIER';

export interface ITokenModifier {
    add(token: Token): Promise<void>;
}