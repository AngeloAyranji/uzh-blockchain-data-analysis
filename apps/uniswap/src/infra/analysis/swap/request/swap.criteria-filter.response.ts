export class SwapCriteriaFilterResponse {
    id: string;
    transactionHash: string;
    sender: string;
    recipient: string;
    amountIn: number;
    amountOut: number;
    reversed: boolean;
    price: number;
    swapAt: Date;
    pool: {
        tokenIn: string;
        tokenOut: string;
    };
}