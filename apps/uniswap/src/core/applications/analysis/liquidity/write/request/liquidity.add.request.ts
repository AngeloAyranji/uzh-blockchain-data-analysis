import { LiquidityTypeEnum } from "../../../../../domains/analysis/liquidity";

export class LiquidityAddRequest {
    poolId: string;
    transactionHash: string;
    owner: string;
    amount0: string;
    amount1: string;
    type: LiquidityTypeEnum;
    timestamp: Date;
}