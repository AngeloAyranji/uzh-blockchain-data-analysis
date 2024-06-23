import { Injectable } from "@nestjs/common";
import { ISwapControllerReadMapper } from "./iswap.read.mapper";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapApiResponse, SwapGetAllWithPaginationApiResponse, SwapWithPoolApiResponse } from "../dto/swap.get-all-with-pagination.api.response";
import { PaginationContext } from "../../../../core/domains/valueobject/paginationContext";
import { SwapGetActivePoolsApiResponse } from "../dto/swap.get-active-pools.api.response";
import { SwapGetActiveAddressesApiResponse } from "../dto/swap.get-active-addresses.api.response";
import { SwapGetPriceApiResponse } from "../dto/swap.get-price.api.response";
import { SwapGetAllWithPaginationApiRequest } from "../dto/swap.get-all-with-pagination.api.request";
import { SwapCriteriaRequest } from "../../../../core/applications/analysis/swap/read/requests/swap.criteria.request";
import { SwapCriteriaResponse } from "apps/uniswap/src/core/applications/analysis/swap/read/requests/swap.criteria.response";

@Injectable()
export class SwapControllerReadMapper implements ISwapControllerReadMapper {
    mapSwapsToSwapsApiResponse(swaps: Swap[]): SwapApiResponse[] {
        return swaps.map((swap) => {
            return {
                transactionHash: swap.transactionHash,
                sender: swap.sender,
                recipient: swap.recipient,
                amountIn: swap.amountIn,
                amountOut: swap.amountOut,
                reversed: swap.reversed,
                price: swap.price,
                swapAt: swap.swapAt,
            }
        });
    }

    mapSwapsCriteriaResponseToSwapsWithPoolApiResponse(swaps: SwapCriteriaResponse[]): SwapWithPoolApiResponse[] {
        return swaps.map((swap) => {
            return {
                transactionHash: swap.transactionHash,
                sender: swap.sender,
                recipient: swap.recipient,
                amountIn: swap.amountIn,
                amountOut: swap.amountOut,
                reversed: swap.reversed,
                price: swap.price,
                swapAt: swap.swapAt,
                pool: {
                    tokenIn: swap.pool.tokenIn,
                    tokenOut: swap.pool.tokenOut,
                }
            }
        });
    }

    mapPaginatedSwapsToPaginatedSwapsApiResponse(request: PaginationContext<SwapCriteriaResponse>): SwapGetAllWithPaginationApiResponse {
        return {
            swaps: this.mapSwapsCriteriaResponseToSwapsWithPoolApiResponse(request.payload),
            pagination: {
                totalCount: request.pagination.totalCount,
                page: request.pagination.page,
                limit: request.pagination.limit,
                totalPages: request.pagination.totalPages,
                nextPage: request.pagination.nextPage,
                prevPage: request.pagination.prevPage,
                hasNextPage: request.pagination.hasNextPage,
                hasPrevPage: request.pagination.hasPrevPage,
            }
        }
    }

    mapTopActivePoolsToTopActivePoolsApiResponse(activePools: any[]): SwapGetActivePoolsApiResponse[] {
        return activePools.map((activePool) => {
            return {
                poolAddress: activePool.poolAddress,
                count: activePool.count,
                percentage: activePool.percentage,
                poolTokens: activePool.poolTokens,
            }
        });
    }

    mapTopActiveAddressesToTopActiveAddressesApiResponse(activeAddresses: any[]): SwapGetActiveAddressesApiResponse[] {
        return activeAddresses.map((activeAddress) => {
            return {
                address: activeAddress.address,
                count: activeAddress.count,
                percentage: activeAddress.percentage,
            }
        });
    }

    mapPricetoPriceApiResponse(price: any[]): SwapGetPriceApiResponse[] {
        return price.map((price) => {
            return {
                date: price.date,
                averagePrice: price.averagePrice,
            }
        });
    }

    mapSwapGetAllWithPaginationApiRequestToSwapCriteriaRequest(request: SwapGetAllWithPaginationApiRequest): SwapCriteriaRequest {
        return {
            chainId: request.chainId,
            poolId: request.poolId,
            token: request.token,
            startDate: request.startDate,
            endDate: request.endDate,
            page: request.page,
            limit: request.limit,
        }
    }

}