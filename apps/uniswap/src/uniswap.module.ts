import { Module } from '@nestjs/common';
import { CollectionDbModule } from '@uzh/collection-db';
import { UniswapDbHandler } from './infra/db/uniswap-db.handler';

@Module({
  imports: [CollectionDbModule],
  controllers: [],
  providers: [UniswapDbHandler],
})
export class UniswapModule {}
