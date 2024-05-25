import { Module } from '@nestjs/common';
import { CollectionDbModule } from '@uzh/collection-db';
import { UniswapDbHandler } from './infra/db/uniswap-db.handler';
import { BullModule } from '@nestjs/bull';

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
  providers: [UniswapDbHandler],
})
export class UniswapModule {}
