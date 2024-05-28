import { Injectable } from "@nestjs/common";
import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapEntity } from "../swap.entity";
import { ISwapMapper } from "./iswap.mapper";

@Injectable()
export class SwapMapper implements ISwapMapper {
    mapDomainToEntity(domain: Swap): SwapEntity {
        return {
            id: domain.id,
            poolAddress: domain.poolAddress,
            transactionHash: domain.transactionHash,
            sender: domain.sender,
            recipient: domain.recipient,
            amountIn: domain.amountIn,
            amountOut: domain.amountOut,
            reversed: domain.reversed,
            timestamp: domain.timestamp,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }

    mapEntityToDomain(entity: SwapEntity): Swap {
        return {
            id: entity.id,
            poolAddress: entity.poolAddress,
            transactionHash: entity.transactionHash,
            sender: entity.sender,
            recipient: entity.recipient,
            amountIn: entity.amountIn,
            amountOut: entity.amountOut,
            reversed: entity.reversed,
            timestamp: entity.timestamp
        }
    }

    mapEntitiesToDomains(entities: SwapEntity[]): Swap[] {
        return entities.map(entity => this.mapEntityToDomain(entity));
    }

    mapDomainsToEntities(domains: Swap[]): SwapEntity[] {
        return domains.map(domain => this.mapDomainToEntity(domain));
    }
}