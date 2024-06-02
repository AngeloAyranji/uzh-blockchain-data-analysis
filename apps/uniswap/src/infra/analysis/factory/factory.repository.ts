import { Inject, Injectable } from '@nestjs/common';
import { FACTORY_MAPPER, IFactoryMapper } from './mapper/ifactory.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Factory } from '../../../core/domains/analysis/factory';
import { IFactoryProvider } from '../../../core/applications/analysis/factory/read/ifactory.provider';

@Injectable()
export class FactoryRepository implements IFactoryProvider {
  constructor(
    @Inject(FACTORY_MAPPER)
    private readonly factoryMapper: IFactoryMapper,
    private readonly uniswapDbHandler: UniswapDbHandler,
  ) {}

  async findAllByChainId(chainId: number): Promise<Factory[]> {
    const entities = await this.uniswapDbHandler.factory.findMany({
        where: {
            chainId: chainId
        }
    });
    return this.factoryMapper.mapEntitiesToDomains(entities);
  }

  async findByAddressAndChainId(factoryAddress: string, chainId: number): Promise<Factory> {
    const entity = await this.uniswapDbHandler.factory.findUnique({
        where: {
            unique_chain_id_address: {
              chainId: chainId,
              address: factoryAddress
            }
        }
    });
    return this.factoryMapper.mapEntityToDomain(entity);
  }
}