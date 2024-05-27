import { Inject, Injectable } from '@nestjs/common';
import { FACTORY_PROVIDER, IFactoryProvider } from './ifactory.provider';
import { IFactoryReadService } from './ifactory.read.service';
import { Factory } from '../../../../../core/domains/analysis/factory';

@Injectable()
export class FactoryReadService implements IFactoryReadService {
    constructor(
        @Inject(FACTORY_PROVIDER) 
        private readonly factoryProvider: IFactoryProvider,
    ) {}

    async findAllByChainId(chainId: number): Promise<Factory[]> {
        return await this.factoryProvider.findAllByChainId(chainId);
    }

    async findByAddress(factoryAddress: string): Promise<Factory> {
        const factory = await this.factoryProvider.findByAddress(factoryAddress);

        if (!factory) {
            // TODO: Create a custom exception
            throw new Error('Factory not found');
        }

        return factory;
    }
}