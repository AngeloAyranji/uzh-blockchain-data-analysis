import { Inject, Injectable } from "@nestjs/common";
import { ILogReadService } from "./ilog.read.service";
import { Log } from "../../../../domains/collection/log";
import { ILogProvider, LOG_PROVIDER } from "./ilog.provider";

@Injectable()
export class LogReadService implements ILogReadService {
    constructor(
        @Inject(LOG_PROVIDER) 
        private readonly logProvider: ILogProvider,
    ) {}

    async findLogsByTopic0AndAddress(address: string, topic0: string): Promise<Log[]> {
        return this.logProvider.findLogsByTopic0AndAddress(address, topic0);
    }
}