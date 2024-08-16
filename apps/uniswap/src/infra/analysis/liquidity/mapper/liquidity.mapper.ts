import { Injectable } from '@nestjs/common';
import { Liquidity } from '../../../../core/domains/analysis/liquidity';
import { LiquidityEntity } from '../liquidity.entity';
import { ILiquidityMapper } from './iliquidity.mapper';

@Injectable()
export class LiquidityMapper implements ILiquidityMapper {
  mapDomainToEntity(domain: Liquidity): LiquidityEntity {
    return {
      id: domain.id,
      poolId: domain.poolId,
      transactionHash: domain.transactionHash,
      owner: domain.owner,
      amount0: domain.amount0,
      amount1: domain.amount1,
      type: domain.type,
      timestamp: domain.timestamp,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  mapEntityToDomain(entity: LiquidityEntity): Liquidity {
    return {
      id: entity.id,
      poolId: entity.poolId,
      transactionHash: entity.transactionHash,
      owner: entity.owner,
      amount0: entity.amount0,
      amount1: entity.amount1,
      type: entity.type,
      timestamp: entity.timestamp,
    };
  }

  mapEntitiesToDomains(entities: LiquidityEntity[]): Liquidity[] {
    return entities.map((entity) => this.mapEntityToDomain(entity));
  }

  mapDomainsToEntities(domains: Liquidity[]): LiquidityEntity[] {
    return domains.map((domain) => this.mapDomainToEntity(domain));
  }
}
