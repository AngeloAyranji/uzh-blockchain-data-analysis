import { Inject, Injectable } from '@nestjs/common';
import { IPoolMapper } from './ipool.mapper';
import { PoolEntity } from '../pool.entity';
import { Pool } from '../../../../core/domains/analysis/pool';
import { PoolCountByDateResponse, PoolCountDateEnum } from '../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response';
import { VersionEnum } from '../../../../core/domains/analysis/factory';

@Injectable()
export class PoolMapper implements IPoolMapper {
  mapEntityToDomain(entity: PoolEntity): Pool {
    return {
      poolAddress: entity.poolAddress,
      token0: entity.token0,
      token1: entity.token1,
      factoryAddress: entity.factoryAddress,
      deployedAt: entity.deployedAt,
    };
  }

  mapEntitiesToDomains(entities: PoolEntity[]): Pool[] {
    return entities.map((entity) => this.mapEntityToDomain(entity));
  }

  mapDomainToEntity(domain: Pool): PoolEntity {
    return {
      poolAddress: domain.poolAddress,
      token0: domain.token0,
      token1: domain.token1,
      factoryAddress: domain.factoryAddress,
      deployedAt: domain.deployedAt,
    };
  }

  mapDomainsToEntities(domains: Pool[]): PoolEntity[] {
    return domains.map((domain) => this.mapDomainToEntity(domain));
  }

  mapPoolCountByDateToPoolCountByDateResponse(
    poolCountByDate: any[],
    version: VersionEnum,
    chainId: number,
    dateType: PoolCountDateEnum
  ): PoolCountByDateResponse[] {
    return poolCountByDate.map((poolCount) => {
      return {
        date: poolCount.date,
        totalCount: Number(poolCount.totalCount),
        version: version,
        chainId: chainId,
        poolCountDateEnum: dateType,
      };
    });
  }
}
