import { Token } from '@prisma/client-uniswap';

export class TokenEntity implements Token {
    id: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    chainId: number;
}