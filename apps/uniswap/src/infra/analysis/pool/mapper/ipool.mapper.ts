import { VersionEnum } from '../../../../core/domains/analysis/factory';
import { PoolCountByDateResponse, PoolCountDateEnum } from '../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response';
import { Pool } from '../../../../core/domains/analysis/pool';
import { PoolEntity } from '../pool.entity';

export const POOL_MAPPER = 'POOL_MAPPER';

export interface IPoolMapper {
  mapDomainToEntity(domain: Pool): PoolEntity;
  mapDomainsToEntities(domains: Pool[]): PoolEntity[];
  mapEntityToDomain(entity: PoolEntity): Pool;
  mapEntitiesToDomains(entities: PoolEntity[]): Pool[];
  mapPoolCountByDateToPoolCountByDateResponse(
    poolCountByDate: any[],
    version: VersionEnum,
    chainId: number,
    dateType: PoolCountDateEnum
  ): PoolCountByDateResponse[];
}
