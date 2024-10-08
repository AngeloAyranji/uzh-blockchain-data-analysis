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
import { SwapCriteriaResponse } from "../../../../core/applications/analysis/swap/read/requests/swap.criteria.response";
import { SwapGetByPoolAddressApiResponse } from "../dto/swap.get-swaps-get-by-pool-address.response";
import { SwapGetPriceByPairApiResponse } from "../dto/swap.get-price-by-pair.response";
import { SwapGetDistinctUsersByDateApiResponse } from "../dto/swap.get-distinct-users.api.response";
import { SwapGetNewUsersByDateApiResponse } from "../dto/swap.get-new-users-by-data.api.response";

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
                swapAt: new Date(swap.swapAt).toLocaleDateString(),
                tokenIn: swap.pool.tokenIn,
                tokenOut: swap.pool.tokenOut,
                tokenInSymbol: swap.pool.tokenInSymbol,
                tokenOutSymbol: swap.pool.tokenOutSymbol,
                version: swap.pool.factory.version,
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
                average_price: price.average_price,
                max_price: price.max_price,
                min_price: price.min_price,
            }
        });
    }

    mapPriceByPairtoPriceByPairApiResponse(price: any[]): SwapGetPriceByPairApiResponse[] {
        return price.map((price) => {
            return {
                date: price.date,
                average_price: price.average_price,
                max_price: price.max_price,
                min_price: price.min_price,
            }
        });
    }

    mapSwapGetAllWithPaginationApiRequestToSwapCriteriaRequest(request: SwapGetAllWithPaginationApiRequest): SwapCriteriaRequest {
        return {
            chainId: request.chainId,
            poolAddress: request.poolAddress,
            token: request.token,
            startDate: request.startDate,
            endDate: request.endDate,
            page: request.page,
            limit: request.limit,
        }
    }

    mapSwapsByPoolAddressToSwapsByPoolAddressApiResponse(swaps: any[]): SwapGetByPoolAddressApiResponse[] {
        return swaps.map((swap) => {
            return {
                date: swap.date,
                swapCount: swap.count,
            }
        });
    }

    mapNewUsersByDatetoNewUsersByDateApiResponse(newUsers: any[]): SwapGetNewUsersByDateApiResponse[] {
        return newUsers.map((newUser) => {
            return {
                date: newUser.date,
                newUsers: newUser.count,
            }
        });
    }

    mapDistinctUsersByDatetoDistinctUsersByDateApiResponse(distinctUsers: any[]): SwapGetDistinctUsersByDateApiResponse[] {
        return distinctUsers.map((distinctUser) => {
            return {
                date: distinctUser.date,
                distinctUsers: distinctUser.count,
            }
        });
    }
}