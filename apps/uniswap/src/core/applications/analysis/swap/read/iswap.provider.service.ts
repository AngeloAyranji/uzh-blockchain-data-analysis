import { PaginationContext } from "../../../../../core/domains/valueobject/paginationContext";
import { Swap } from "../../../../../core/domains/analysis/swap";

export const SWAP_PROVIDER = 'SWAP_PROVIDER';

export interface ISwapProvider {
    findSwapsWithPagination(chainId: number, page: number, limit: number): Promise<PaginationContext<Swap>>
}