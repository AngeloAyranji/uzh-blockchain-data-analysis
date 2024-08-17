import { Inject, Injectable } from '@nestjs/common';
import { ILiquidityMapper, LIQUIDITY_MAPPER } from './mapper/iliquidity.mapper';
import { ILiquidityModifier } from '../../../core/applications/analysis/liquidity/write/iliquidity.modifier';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Liquidity } from '../../../core/domains/analysis/liquidity';
import { ILiquidityProvider } from '../../../core/applications/analysis/liquidity/read/iliquidity.provider';

@Injectable()
export class LiquidityRepository implements ILiquidityModifier, ILiquidityProvider {

  constructor(
    @Inject(LIQUIDITY_MAPPER)
    private readonly liquidityMapper: ILiquidityMapper,
    private readonly uniswapDbHandler: UniswapDbHandler
  ) {}

  async createMany(liquidity: Liquidity[]): Promise<void> {
    const entities = this.liquidityMapper.mapDomainsToEntities(liquidity);
    await this.uniswapDbHandler.liquidity.createMany({
        data: entities
    })
  }
}