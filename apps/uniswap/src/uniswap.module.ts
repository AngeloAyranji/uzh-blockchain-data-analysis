import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { CollectionDbModule } from '@uzh/collection-db';
import { UniswapDbHandler } from './infra/db/uniswap-db.handler';
import { FACTORY_READ_SERVICE } from './core/applications/factory/read/ifactory.read.service';
import { FactoryReadService } from './core/applications/factory/read/factory.read.service';
import { FACTORY_MAPPER } from './infra/analysis/factory/mapper/ifactory.mapper';
import { FactoryMapper } from './infra/analysis/factory/mapper/factory.mapper';
import { FACTORY_PROVIDER } from './core/applications/factory/read/ifactory.provider';
import { FactoryRepository } from './infra/analysis/factory/factory.repository';
import { MIGRATION_PROCESSOR_SERVICE } from './core/applications/migration/processor/imigration.processor.service';
import { MigrationProcessorService } from './core/applications/migration/processor/migration.processor.service';

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
      provide: MIGRATION_PROCESSOR_SERVICE,
      useClass: MigrationProcessorService,
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
  ],
})
export class UniswapModule {}
