import { PaginationContext } from "../../../../core/domains/valueobject/paginationContext";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapApiResponse, SwapGetAllWithPaginationApiResponse } from "../dto/swap.get-all-with-pagination.api.response";

export const SWAP_CONTROLLER_READ_MAPPER = 'SWAP_CONTROLLER_READ_MAPPER';

export interface ISwapControllerReadMapper {
    mapSwapsToSwapsApiResponse(swaps: Swap[]): SwapApiResponse[];
    mapPaginatedSwapsToPaginatedSwapsApiResponse(request: PaginationContext<Swap>): SwapGetAllWithPaginationApiResponse
}