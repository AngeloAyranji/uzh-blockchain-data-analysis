
import { Inject, Injectable } from '@nestjs/common';
import { POOL_PROVIDER, IPoolProvider } from './ipool.provider';
import { IPoolReadService } from './ipool.read.service';
import { PoolTotalCountResponse } from './response/pool.total-count.response';
import { FACTORY_READ_SERVICE, IFactoryReadService } from '../../factory/read/ifactory.read.service';

@Injectable()
export class PoolReadService implements IPoolReadService {
    constructor(
        @Inject(POOL_PROVIDER) 
        private readonly poolProvider: IPoolProvider,

        @Inject(FACTORY_READ_SERVICE)
        private readonly factoryReadService: IFactoryReadService,
    ) {}

    async getTotalCount(chainId: number): Promise<PoolTotalCountResponse[]> {
        const groupedPools =  await this.poolProvider.getTotalCount(chainId);

        const populatedGroupedPools: PoolTotalCountResponse[] = await Promise.all(groupedPools.map(async (res) => {
            const factory = await this.factoryReadService.findByAddress(res.factoryAddress);

            return {
                totalCount: res.totalCount,
                factoryAddress: res.factoryAddress,
                factoryVersion: factory.version,
            };
        }));

        return populatedGroupedPools;
    }   
}