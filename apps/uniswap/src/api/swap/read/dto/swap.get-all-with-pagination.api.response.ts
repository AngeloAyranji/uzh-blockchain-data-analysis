export class SwapApiResponse {
    transactionHash: string;
    sender: string;
    recipient: string;
    amountIn: string;
    amountOut: string;
    reversed: boolean;
    price: string | null;
    swapAt: Date;
}

export class PaginationApiResponse {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export class SwapGetAllWithPaginationApiResponse {
    swaps: SwapApiResponse[];
    pagination: PaginationApiResponse;
}