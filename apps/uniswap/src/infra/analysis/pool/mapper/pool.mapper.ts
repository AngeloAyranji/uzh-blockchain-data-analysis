import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IPoolMapper } from './ipool.mapper';
import { PoolEntity } from '../pool.entity';
import { Pool } from '../../../../core/domains/analysis/pool';
import { PoolCountByDateResponse, PoolCountDateEnum } from '../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response';
import { VersionEnum } from '../../../../core/domains/analysis/factory';

@Injectable()
export class PoolMapper implements IPoolMapper {
  mapEntityToDomain(entity: PoolEntity): Pool {
    return {
      id: entity.id,
      poolAddress: entity.poolAddress,
      token0: entity.token0,
      token1: entity.token1,
      factoryId: entity.factoryId,
      deployedAt: entity.deployedAt,
    };
  }

  mapEntitiesToDomains(entities: PoolEntity[]): Pool[] {
    return entities.map((entity) => this.mapEntityToDomain(entity));
  }

  mapDomainToEntity(domain: Pool): PoolEntity {
    return {
      id: uuidv4(),
      poolAddress: domain.poolAddress,
      token0: domain.token0,
      token1: domain.token1,
      factoryId: domain.factoryId,
      deployedAt: domain.deployedAt,
    };
  }

  mapDomainsToEntities(domains: Pool[]): PoolEntity[] {
    return domains.map((domain) => this.mapDomainToEntity(domain));
  }

  mapPoolCountByDateToPoolCountByDateResponse(
    counts: any[]
  ): PoolCountByDateResponse[] {
    const dateMap: Map<string, { totalCountV2: bigint; totalCountV3: bigint }> = new Map();

    counts.forEach(count => {
      const date = count.date.toISOString().split('T')[0]; // Convert date to string format
      const version = count.version;
      const totalCount = count.totalcount;
      
      if (!dateMap.has(date)) {
        dateMap.set(date, { totalCountV2: 0n, totalCountV3: 0n });
      }
  
      const dateCounts = dateMap.get(date);
      if (version === 'V2') {
        dateCounts.totalCountV2 = totalCount;
      } else if (version === 'V3') {
        dateCounts.totalCountV3 = totalCount;
      }
    });
  
    // Convert map to array of responses
    return Array.from(dateMap.entries()).map(([date, counts]) => ({
      date,
      totalCountV2: counts.totalCountV2,
      totalCountV3: counts.totalCountV3,
    }));
  }
}
