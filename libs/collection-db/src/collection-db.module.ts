import { Module } from '@nestjs/common';
import { CollectionDbHandler } from './collection-db.handler';

@Module({
  providers: [CollectionDbHandler],
  exports: [CollectionDbHandler],
})
export class CollectionDbModule {}
