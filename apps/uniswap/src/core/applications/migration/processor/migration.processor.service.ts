import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IMigrationProcessorService } from './imigration.processor.service';
import { FACTORY_READ_SERVICE, IFactoryReadService } from '../../factory/read/ifactory.read.service';

@Injectable()
export class MigrationProcessorService implements IMigrationProcessorService {
    constructor(
        @InjectQueue('extract') 
        private readonly extractQueue: Queue,

        @Inject(FACTORY_READ_SERVICE)
        private readonly factoryReadService: IFactoryReadService,
    ) {
        this.startMigration();
    }

    async startMigration() {
        const factories = await this.factoryReadService.findAllByChainId(1);
        
        console.log(factories);
    }
}