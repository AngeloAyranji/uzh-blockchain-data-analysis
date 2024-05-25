import { Log } from "../../../../domains/collection/log";

export const LOG_PROVIDER = 'LOG_PROVIDER';

export interface ILogProvider {
    findLogsByTopic0AndAddress(address: string, topic0: string): Promise<Log[]>;
    findTotalCountByTopic0AndAddress(address: string, topic0: string): Promise<number>;
}