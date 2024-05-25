import { Inject, Injectable } from '@nestjs/common';
import { FACTORY_MAPPER, IFactoryMapper } from './mapper/ifactory.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Factory } from '../../../core/domains/analysis/factory';

@Injectable()
export class FactoryRepository {
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
}