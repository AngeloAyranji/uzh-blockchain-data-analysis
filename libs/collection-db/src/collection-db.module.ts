import { Module } from '@nestjs/common';
import { CollectionDbService } from './collection-db.service';

@Module({
  providers: [CollectionDbService],
  exports: [CollectionDbService],
})
export class CollectionDbModule {}
