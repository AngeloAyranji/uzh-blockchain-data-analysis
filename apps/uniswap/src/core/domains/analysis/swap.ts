export class Swap {
    id: string;
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

export enum TimeframeEnum {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}