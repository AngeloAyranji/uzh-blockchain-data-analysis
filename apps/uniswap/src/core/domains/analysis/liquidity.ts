export class Liquidity {
    id: string;
    poolId: string;
    transactionHash: string;
    owner: string;
    amount0: string;
    amount1: string;
    type: LiquidityTypeEnum;
    timestamp: Date;
}

export enum LiquidityTypeEnum {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}