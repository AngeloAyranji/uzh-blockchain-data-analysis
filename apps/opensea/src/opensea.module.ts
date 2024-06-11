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
