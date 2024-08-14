import { Inject, Injectable } from '@nestjs/common';
import { FACTORY_PROVIDER, IFactoryProvider } from './ifactory.provider';
import { IFactoryReadService } from './ifactory.read.service';
import { Factory } from '../../../../../core/domains/analysis/factory';

@Injectable()
export class FactoryReadService implements IFactoryReadService {
  constructor(
    @Inject(FACTORY_PROVIDER)
    private readonly factoryProvider: IFactoryProvider
  ) {}

  async findAllByChainId(chainId: number): Promise<Factory[]> {
    return await this.factoryProvider.findAllByChainId(chainId);
  }

  async findByAddressAndChainId(
    factoryAddress: string,
    chainId: number
  ): Promise<Factory> {
    const factory = await this.factoryProvider.findByAddressAndChainId(
      factoryAddress,
      chainId
    );

    if (!factory) {
      throw new Error('Factory not found');
    }

    return factory;
  }

  async findById(id: string): Promise<Factory> {
    const factory = await this.factoryProvider.findById(id);

    if (!factory) {
      throw new Error('Factory not found');
    }

    return factory;
  }
}
