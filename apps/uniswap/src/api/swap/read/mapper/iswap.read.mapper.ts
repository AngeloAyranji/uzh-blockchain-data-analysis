import { PaginationContext } from "../../../../core/domains/valueobject/paginationContext";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapApiResponse, SwapGetAllWithPaginationApiResponse } from "../dto/swap.get-all-with-pagination.api.response";
import { SwapGetActivePoolsApiResponse } from "../dto/swap.get-active-pools.api.response";
import { SwapGetActiveAddressesApiResponse } from "../dto/swap.get-active-addresses.api.response";
import { SwapGetPriceApiResponse } from "../dto/swap.get-price.api.response";
import { SwapGetAllWithPaginationApiRequest } from "../dto/swap.get-all-with-pagination.api.request";
import { SwapCriteriaRequest } from "../../../../core/applications/analysis/swap/read/requests/swap.criteria.request";
import { SwapCriteriaResponse } from "../../../../core/applications/analysis/swap/read/requests/swap.criteria.response";
import { SwapGetByPoolAddressApiResponse } from "../dto/swap.get-swaps-get-by-pool-address.response";
import { SwapGetPriceByPairApiResponse } from "../dto/swap.get-price-by-pair.response";

export const SWAP_CONTROLLER_READ_MAPPER = 'SWAP_CONTROLLER_READ_MAPPER';

export interface ISwapControllerReadMapper {
    mapSwapsToSwapsApiResponse(swaps: Swap[]): SwapApiResponse[];
    mapPaginatedSwapsToPaginatedSwapsApiResponse(request: PaginationContext<SwapCriteriaResponse>): SwapGetAllWithPaginationApiResponse;
    mapTopActivePoolsToTopActivePoolsApiResponse(activePools: any[]): SwapGetActivePoolsApiResponse[];
    mapTopActiveAddressesToTopActiveAddressesApiResponse(activeAddresses: any[]): SwapGetActiveAddressesApiResponse[];
    mapPricetoPriceApiResponse(price: any[]): SwapGetPriceApiResponse[];
    mapSwapGetAllWithPaginationApiRequestToSwapCriteriaRequest(request: SwapGetAllWithPaginationApiRequest): SwapCriteriaRequest;
    mapSwapsByPoolAddressToSwapsByPoolAddressApiResponse(swaps: any[]): SwapGetByPoolAddressApiResponse[];
    mapPriceByPairtoPriceByPairApiResponse(price: any[]): SwapGetPriceByPairApiResponse[];
}