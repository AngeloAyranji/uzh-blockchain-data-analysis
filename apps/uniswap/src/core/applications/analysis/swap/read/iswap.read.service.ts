import { PaginationContext } from "../../../../../core/domains/valueobject/paginationContext";
import { Swap } from "../../../../../core/domains/analysis/swap";

export const SWAP_READ_SERVICE = 'SWAP_READ_SERVICE';

export interface ISwapReadService {
    findSwapsWithPagination(chainId: number, page: number, limit: number): Promise<PaginationContext<Swap>>
}