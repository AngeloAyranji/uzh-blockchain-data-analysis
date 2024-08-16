import { Liquidity } from "../../../../core/domains/analysis/liquidity";
import { LiquidityEntity } from "../liquidity.entity";

export const LIQUIDITY_MAPPER = 'LIQUIDITY_MAPPER';

export interface ILiquidityMapper {
    mapEntityToDomain(entity: LiquidityEntity): Liquidity;
    mapDomainToEntity(domain: Liquidity): LiquidityEntity;
    mapEntitiesToDomains(entities: LiquidityEntity[]): Liquidity[];
    mapDomainsToEntities(domains: Liquidity[]): LiquidityEntity[];
}