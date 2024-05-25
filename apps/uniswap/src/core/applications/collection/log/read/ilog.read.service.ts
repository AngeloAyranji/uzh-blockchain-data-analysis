import { Log } from "../../../../domains/collection/log";

export const LOG_READ_SERVICE = 'LOG_READ_SERVICE';

export interface ILogReadService {
    findLogsByTopic0AndAddress(address: string, topic0: string): Promise<Log[]>;
}