import { Module } from '@nestjs/common';
import { CollectionDbModule } from '@uzh/collection-db';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { LOG_PROVIDER } from './core/applications/collection/log/read/ilog.provider';
import { LOG_READ_SERVICE } from './core/applications/collection/log/read/ilog.read.service';
import { LogReadService } from './core/applications/collection/log/read/log.read.service';
import { LogRepository } from './infra/log/log.repository';
import { LOG_MAPPER } from './infra/log/mapper/ilog.mapper';
import { LogMapper } from './infra/log/mapper/log.mapper';
import { EXTRACT_PROCESSOR } from './core/applications/migration/extract/iextract.processor';
import { ExtractProcessor } from './core/applications/migration/extract/extract.processor';
import { TRANSFORM_PROCESSOR } from './core/applications/migration/transform/itransform.processor';
import { TransformProcessor } from './core/applications/migration/transform/transform.processor';
import { LOAD_PROCESSOR } from './core/applications/migration/load/iload.processor';
import { LoadProcessor } from './core/applications/migration/load/load.processor';

@Module({
  imports: [
    CollectionDbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'transform',
    }),
    BullModule.registerQueue({
      name: 'load',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: EXTRACT_PROCESSOR,
      useClass: ExtractProcessor,
    },
    {
      provide: TRANSFORM_PROCESSOR,
      useClass: TransformProcessor,
    },
    {
      provide: LOAD_PROCESSOR,
      useClass: LoadProcessor,
    },
    // LOG
    {
      provide: LOG_READ_SERVICE,
      useClass: LogReadService,
    },
    {
      provide: LOG_PROVIDER,
      useClass: LogRepository,
    },
    {
      provide: LOG_MAPPER,
      useClass: LogMapper,
    },
  ],
})
export class OpenseaModule {}
