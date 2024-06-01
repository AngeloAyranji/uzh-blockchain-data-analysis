export class Swap {
    id: string;
    poolId: string;
    transactionHash: string;
    sender: string;
    recipient: string;
    amountIn: string;
    amountOut: string;
    reversed: boolean;
    timestamp: Date;
}