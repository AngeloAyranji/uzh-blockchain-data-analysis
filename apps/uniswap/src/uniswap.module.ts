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
import { TRANSFORM_PROCESSOR } from './core/applications/migration/transform/itransform.processor';
import { TransformProcessor } from './core/applications/migration/transform/transform.processor';
import { LOAD_PROCESSOR } from './core/applications/migration/load/iload.processor';
import { LoadProcessor } from './core/applications/migration/load/load.processor';
import { POOL_REQUEST_MAPPER } from './core/applications/analysis/pool/write/mapper/ipool.request.mapper';
import { PoolRequestMapper } from './core/applications/analysis/pool/write/mapper/pool.request.mapper';
import { POOL_WRITE_SERVICE } from './core/applications/analysis/pool/write/ipool.write.service';
import { PoolWriteService } from './core/applications/analysis/pool/write/pool.write.service';
import { POOL_MODIFIER } from './core/applications/analysis/pool/write/ipool.modifier';
import { PoolRepository } from './infra/analysis/pool/pool.repository';
import { POOL_MAPPER } from './infra/analysis/pool/mapper/ipool.mapper';
import { PoolMapper } from './infra/analysis/pool/mapper/pool.mapper';
import { PoolReadController } from './api/pool/read/pool.read.controller';
import { POOL_READ_SERVICE } from './core/applications/analysis/pool/read/ipool.read.service';
import { PoolReadService } from './core/applications/analysis/pool/read/pool.service';
import { POOL_PROVIDER } from './core/applications/analysis/pool/read/ipool.provider';
import { POOL_CONTROLLER_READ_MAPPER } from './api/pool/read/mapper/ipool.read.mapper';
import { PoolControllerReadMapper } from './api/pool/read/mapper/pool.read.mapper';
import { SWAP_REQUEST_MAPPER } from './core/applications/analysis/swap/write/mapper/iswap.request.mapper';
import { SwapRequestMapper } from './core/applications/analysis/swap/write/mapper/swap.request.mapper';
import { SWAP_WRITE_SERVICE } from './core/applications/analysis/swap/write/iswap.write.service';
import { SwapWriteService } from './core/applications/analysis/swap/write/swap.write.service';
import { SWAP_MODIFIER } from './core/applications/analysis/swap/write/iswap.modifier';
import { SwapRepository } from './infra/analysis/swap/swap.repository';
import { SWAP_MAPPER } from './infra/analysis/swap/mapper/iswap.mapper';
import { SwapMapper } from './infra/analysis/swap/mapper/swap.mapper';
import { SWAP_READ_SERVICE } from './core/applications/analysis/swap/read/iswap.read.service';
import { SwapReadService } from './core/applications/analysis/swap/read/swap.read.service';
import { SWAP_PROVIDER } from './core/applications/analysis/swap/read/iswap.provider.service';

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
  controllers: [
    PoolReadController,
  ],
  providers: [
    UniswapDbHandler,
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
    // POOL
    {
      provide: POOL_CONTROLLER_READ_MAPPER,
      useClass: PoolControllerReadMapper,
    },
    {
      provide: POOL_READ_SERVICE,
      useClass: PoolReadService,
    },
    {
      provide: POOL_REQUEST_MAPPER,
      useClass: PoolRequestMapper,
    },
    {
      provide: POOL_WRITE_SERVICE,
      useClass: PoolWriteService,
    },
    {
      provide: POOL_PROVIDER,
      useClass: PoolRepository,
    },
    {
      provide: POOL_MODIFIER,
      useClass: PoolRepository,
    },
    {
      provide: POOL_MAPPER,
      useClass: PoolMapper,
    },
    {
      provide: SWAP_REQUEST_MAPPER,
      useClass: SwapRequestMapper,
    },
    {
      provide: SWAP_WRITE_SERVICE,
      useClass: SwapWriteService,
    },
    {
      provide: SWAP_READ_SERVICE,
      useClass: SwapReadService,
    },
    {
      provide: SWAP_MODIFIER,
      useClass: SwapRepository,
    },
    {
      provide: SWAP_PROVIDER,
      useClass: SwapRepository,
    },
    {
      provide: SWAP_MAPPER,
      useClass: SwapMapper,
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
