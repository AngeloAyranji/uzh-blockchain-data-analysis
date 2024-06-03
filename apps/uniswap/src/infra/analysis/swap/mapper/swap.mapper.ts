import { Injectable } from "@nestjs/common";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapEntity } from "../swap.entity";
import { ISwapMapper } from "./iswap.mapper";

@Injectable()
export class SwapMapper implements ISwapMapper {
    mapDomainToEntity(domain: Swap): SwapEntity {
        return {
            id: domain.id,
            poolId: domain.poolId,
            transactionHash: domain.transactionHash,
            sender: domain.sender,
            recipient: domain.recipient,
            amountIn: domain.amountIn,
            amountOut: domain.amountOut,
            reversed: domain.reversed,
            price: domain.price,
            swapAt: domain.swapAt,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }

    mapEntityToDomain(entity: SwapEntity): Swap {
        return {
            id: entity.id,
            poolId: entity.poolId,
            transactionHash: entity.transactionHash,
            sender: entity.sender,
            recipient: entity.recipient,
            amountIn: entity.amountIn,
            amountOut: entity.amountOut,
            reversed: entity.reversed,
            price: entity.price,
            swapAt: entity.swapAt
        }
    }

    mapEntitiesToDomains(entities: SwapEntity[]): Swap[] {
        return entities.map(entity => this.mapEntityToDomain(entity));
    }

    mapDomainsToEntities(domains: Swap[]): SwapEntity[] {
        return domains.map(domain => this.mapDomainToEntity(domain));
    }
}