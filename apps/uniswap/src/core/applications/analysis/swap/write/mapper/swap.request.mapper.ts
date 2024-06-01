import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { ISwapRequestMapper } from "./iswap.request.mapper";
import { Swap } from "../../../../../domains/analysis/swap";
import { SwapAddRequest } from "../request/swap.add.request";

@Injectable()
export class SwapRequestMapper implements ISwapRequestMapper {

    mapSwapAddRequestToDomain(swapAddRequest: SwapAddRequest): Swap {
        return {
            id: uuidv4(),
            poolId: swapAddRequest.poolId,
            transactionHash: swapAddRequest.transactionHash,
            sender: swapAddRequest.sender,
            recipient: swapAddRequest.recipient,
            amountIn: swapAddRequest.amountIn,
            amountOut: swapAddRequest.amountOut,
            reversed: swapAddRequest.reversed,
            timestamp: swapAddRequest.timestamp
        }
    }

    mapSwapAddRequestsToDomains(swapAddRequests: SwapAddRequest[]): Swap[] {
        return swapAddRequests.map(swapAddRequest => this.mapSwapAddRequestToDomain(swapAddRequest));
    }
}