import { Pool } from '../../../../core/domains/analysis/pool';
import { PoolEntity } from '../pool.entity';

export const POOL_MAPPER = 'POOL_MAPPER';

export interface IPoolMapper {
  mapDomainToEntity(domain: Pool): PoolEntity;
  mapDomainsToEntities(domains: Pool[]): PoolEntity[];
  mapEntityToDomain(entity: PoolEntity): Pool;
  mapEntitiesToDomains(entities: PoolEntity[]): Pool[];
}
