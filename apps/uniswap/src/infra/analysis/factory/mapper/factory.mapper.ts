import { Injectable } from '@nestjs/common';
import { IFactoryMapper } from './ifactory.mapper';
import { FactoryEntity } from '../factory.entity';
import { Factory, VersionEnum } from '../../../../core/domains/analysis/factory';

@Injectable()
export class FactoryMapper implements IFactoryMapper {
  mapEntityToDomain(entity: FactoryEntity): Factory {
    const domain: Factory = {
      id: entity.id,
      address: entity.address,
      version: VersionEnum[entity.version],
      swapSignature: entity.swapSignature,
      poolCreatedSignature: entity.poolCreatedSignature,
      mintSignature: entity.mintSignature,
      burnSignature: entity.burnSignature,
      chainId: entity.chainId,
    };
    return domain;
  }

  mapEntitiesToDomains(entities: FactoryEntity[]): Factory[] {
    return entities.map((entity) => this.mapEntityToDomain(entity));
  }
}
