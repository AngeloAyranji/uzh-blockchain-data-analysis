import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { CollectionDbModule } from '@uzh/collection-db';
import { UniswapDbHandler } from './infra/db/uniswap-db.handler';
import { FACTORY_READ_SERVICE } from './core/applications/analysis/factory/read/ifactory.read.service';
import { FactoryReadService } from './core/applications/analysis/factory/read/factory.read.service';
import { FACTORY_MAPPER } from './infra/analysis/factory/mapper/ifactory.mapper';
import { FactoryMapper } from './infra/analysis/factory/mapper/factory.mapper';
import { FACTORY_PROVIDER } from './core/applications/analysis/factory/read/ifactory.provider';
import { FactoryRepository } from './infra/analysis/factory/factory.repository';
import { EXTRACT_PROCESSOR } from './core/applications/migration/extract/iextract.processor';
import { ExtractProcessor } from './core/applications/migration/extract/extract.processor';
import { LOG_READ_SERVICE } from './core/applications/collection/log/read/ilog.read.service';
import { LogReadService } from './core/applications/collection/log/read/log.read.service';
import { LOG_PROVIDER } from './core/applications/collection/log/read/ilog.provider';
import { LogRepository } from './infra/collection/log/log.repository';
import { LOG_MAPPER } from './infra/collection/log/mapper/ilog.mapper';
import { LogMapper } from './infra/collection/log/mapper/log.mapper';

@Module({
  controllers: [],
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
      name: 'extract',
    }),
    BullModule.registerQueue({
      name: 'transform',
    }),
    BullModule.registerQueue({
      name: 'load',
    }),
  ],
  providers: [
    UniswapDbHandler,
    {
      provide: EXTRACT_PROCESSOR,
      useClass: ExtractProcessor,
    },
    // FACTORY
    {
      provide: FACTORY_READ_SERVICE,
      useClass: FactoryReadService,
    },
    {
      provide: FACTORY_PROVIDER,
      useClass: FactoryRepository,
    },
    {
      provide: FACTORY_MAPPER,
      useClass: FactoryMapper,
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
export class UniswapModule {}
