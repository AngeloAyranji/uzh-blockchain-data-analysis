import { Module } from '@nestjs/common';
import { CollectionDbModule } from '@uzh/collection-db';
import { UniswapDbHandler } from './infra/db/uniswap-db.handler';
import { BullModule } from '@nestjs/bull';
import { FACTORY_READ_SERVICE } from './core/applications/factory/read/ifactory.read.service';
import { FactoryReadService } from './core/applications/factory/read/factory.read.service';
import { FACTORY_MAPPER } from './infra/factory/mapper/ifactory.mapper';
import { FactoryMapper } from './infra/factory/mapper/factory.mapper';
import { FACTORY_PROVIDER } from './core/applications/factory/read/ifactory.provider';
import { FactoryRepository } from './infra/factory/factory.repository';

@Module({
  controllers: [],
  imports: [
    CollectionDbModule,
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
