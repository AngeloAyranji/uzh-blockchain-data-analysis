import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { ILiquidityRequestMapper } from "./iliquidity.request.mapper";
import { LiquidityAddRequest } from "../request/liquidity.add.request";
import { Liquidity } from "../../../../../domains/analysis/liquidity";

@Injectable()
export class LiquidityRequestMapper implements ILiquidityRequestMapper {

    mapAddRequestToDomain(request: LiquidityAddRequest): Liquidity {
        return {
            id: uuidv4(),
            poolId: request.poolId,
            transactionHash: request.transactionHash,
            owner: request.owner,
            amount0: request.amount0,
            amount1: request.amount1,
            type: request.type,
            timestamp: request.timestamp
        }
    }

    mapAddRequestsToDomains(requests: LiquidityAddRequest[]): Liquidity[] {
        return requests.map(request => this.mapAddRequestToDomain(request));
    }
}