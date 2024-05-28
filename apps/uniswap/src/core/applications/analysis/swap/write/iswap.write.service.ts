import { SwapAddRequest } from "./request/swap.add.request";

export const SWAP_WRITE_SERVICE = 'SWAP_WRITE_SERVICE';

export interface ISwapWriteService {
    addMany(swapAddRequests: SwapAddRequest[]): Promise<void>;
}