import { Swap } from "../../../../../domains/analysis/swap";
import { SwapAddRequest } from "../request/swap.add.request";

export const SWAP_REQUEST_MAPPER = 'SWAP_REQUEST_MAPPER';

export interface ISwapRequestMapper {
    mapSwapAddRequestToDomain(swapAddRequest: SwapAddRequest): Swap;
    mapSwapAddRequestsToDomains(swapAddRequests: SwapAddRequest[]): Swap[];
}