import { Swap } from "../../../../core/domains/analysis/swap";
import { SwapEntity } from "../swap.entity";

export const SWAP_MAPPER = 'SWAP_MAPPER';

export interface ISwapMapper {
    mapEntityToDomain(entity: SwapEntity): Swap;
    mapDomainToEntity(domain: Swap): SwapEntity;
    mapEntitiesToDomains(entities: SwapEntity[]): Swap[];
    mapDomainsToEntities(domains: Swap[]): SwapEntity[];
    mapSwapWithPoolEntitytoSwapWithPool(entities: any[]): any[];
}