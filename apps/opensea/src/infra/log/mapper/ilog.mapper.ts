import { Log } from "../../../core/domains/collection/log";
import { LogEntity } from "../log.entity";

export const LOG_MAPPER = 'LOG_MAPPER';

export interface ILogMapper {
    mapEntityToDomain(entity: LogEntity): Log;
    mapEntitiesToDomains(entities: LogEntity[]): Log[];
}