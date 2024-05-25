import { Inject, Injectable } from '@nestjs/common';
import { FACTORY_PROVIDER, IFactoryProvider } from './ifactory.provider';
import { IFactoryReadService } from './ifactory.read.service';

@Injectable()
export class FactoryReadService implements IFactoryReadService {
    constructor(
        @Inject(FACTORY_PROVIDER) 
        private readonly factoryProvider: IFactoryProvider,
    ) {}

    async findAllByChainId(chainId: number) {
        return this.factoryProvider.findAllByChainId(chainId);
    }
}