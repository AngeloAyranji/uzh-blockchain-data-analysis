import { Injectable } from "@nestjs/common";
import { ISwapControllerReadMapper } from "./iswap.read.mapper";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapApiResponse, SwapGetAllWithPaginationApiResponse } from "../dto/swap.get-all-with-pagination.api.response";
import { PaginationContext } from "../../../../core/domains/valueobject/paginationContext";

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

    mapPaginatedSwapsToPaginatedSwapsApiResponse(request: PaginationContext<Swap>): SwapGetAllWithPaginationApiResponse {
        return {
            swaps: this.mapSwapsToSwapsApiResponse(request.payload),
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
}