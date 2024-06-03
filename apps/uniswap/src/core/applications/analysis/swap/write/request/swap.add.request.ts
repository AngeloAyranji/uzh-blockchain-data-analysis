export class SwapAddRequest {
    poolId: string;
    transactionHash: string;
    sender: string;
    recipient: string;
    amountIn: string;
    amountOut: string;
    reversed: boolean;
    price: string | null;
    swapAt: Date;
}