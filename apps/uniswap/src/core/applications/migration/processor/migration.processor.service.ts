import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IMigrationProcessorService } from './imigration.processor.service';

@Injectable()
export class MigrationProcessorService implements IMigrationProcessorService {
    constructor(
        @InjectQueue('extract') private readonly extractQueue: Queue,
    ) {}

    
}