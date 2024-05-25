import { Module } from "@nestjs/common";
import { CollectionDbModule } from "@uzh/collection-db";

@Module({
    imports: [CollectionDbModule],
    controllers: [],
    providers: [],
    exports: []
})
export class UniswapModule {}