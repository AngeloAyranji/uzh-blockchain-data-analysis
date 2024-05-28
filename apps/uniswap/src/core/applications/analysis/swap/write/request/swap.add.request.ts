export class SwapAddRequest {
    poolAddress: string;
    transactionHash: string;
    sender: string;
    recipient: string;
    amountIn: string;
    amountOut: string;
    reversed: boolean;
    timestamp: number;
}