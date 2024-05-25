import { Factory } from "../../../core/domains/factory";
import { FactoryEntity } from "../factory.entity";

export const FACTORY_MAPPER = 'FACTORY_MAPPER';

export interface IFactoryMapper {
    mapEntityToDomain(entity: FactoryEntity): Factory;
    mapEntitiesToDomains(entities: FactoryEntity[]): Factory[];
}