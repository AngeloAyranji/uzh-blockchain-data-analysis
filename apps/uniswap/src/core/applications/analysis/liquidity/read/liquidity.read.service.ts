import { Inject, Injectable } from '@nestjs/common';
import { ILiquidityReadService } from './iliquidity.read.service';
import { ILiquidityProvider, LIQUIDITY_PROVIDER } from './iliquidity.provider';
import { IUniswapContractExternalService, UNISWAP_CONTRACT_EXTERNAL_SERVICE } from '../../../../../external/uniswap-contract/iuniswap-contract.external.service';

@Injectable()
export class LiquidityReadService implements ILiquidityReadService {
  constructor(
    @Inject(LIQUIDITY_PROVIDER)
    private readonly liquidityProvider: ILiquidityProvider,

    @Inject(UNISWAP_CONTRACT_EXTERNAL_SERVICE)
    private readonly uniswapContractExternalService: IUniswapContractExternalService,
  ) {}

  async getTopActiveLiquidityProvidersByPool(
    chainId: number,
    poolAddress: string,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    return await this.liquidityProvider.getTopActiveLiquidityProvidersByPool(chainId, poolAddress, limit, startDate, endDate);
  }
}