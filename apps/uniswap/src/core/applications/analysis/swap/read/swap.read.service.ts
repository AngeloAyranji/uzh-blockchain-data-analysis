import { Inject, Injectable } from '@nestjs/common';
import Big from 'big.js';
import { ISwapReadService } from './iswap.read.service';
import { ISwapProvider, SWAP_PROVIDER } from './iswap.provider.service';
import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';
import { IPoolReadService, POOL_READ_SERVICE } from '../../pool/read/ipool.read.service';
import { SwapCriteriaRequest } from './requests/swap.criteria.request';
import { SwapCriteriaResponse } from './requests/swap.criteria.response';
import { IUniswapContractExternalService, UNISWAP_CONTRACT_EXTERNAL_SERVICE } from '../../../../../external/uniswap-contract/iuniswap-contract.external.service';
import { TimeframeEnum } from 'apps/uniswap/src/core/domains/analysis/swap';

@Injectable()
export class SwapReadService implements ISwapReadService {
  constructor(
    @Inject(SWAP_PROVIDER)
    private readonly swapProvider: ISwapProvider,

    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(UNISWAP_CONTRACT_EXTERNAL_SERVICE)
    private readonly UniswapContractExternalService: IUniswapContractExternalService,
  ) {}

  async getSwapsByPoolAddress(chainId: number, poolAddress: string, startDate?: Date, endDate?: Date): Promise<any> {
    return await this.swapProvider.getSwapsByPoolAddress(chainId, poolAddress, startDate, endDate);
  }

  async findSwapsWithPagination(swapCriteriaRequest: SwapCriteriaRequest): Promise<PaginationContext<SwapCriteriaResponse>> {
    const swaps = await this.swapProvider.findSwapsWithPagination(swapCriteriaRequest);

    const swapsWithTokenInfo = await Promise.all(
      swaps.payload.map(async (swap) => {

        const [tokenIn, tokenOut] = await Promise.all([
          this.UniswapContractExternalService.getDecimalsAndSymbol(swap.pool.tokenIn),
          this.UniswapContractExternalService.getDecimalsAndSymbol(swap.pool.tokenOut),
        ]);
        return {
          ...swap,
          amountIn: new Big(swap.amountIn).div(new Big(10).pow(tokenIn.decimals)).toString(),
          amountOut: new Big(swap.amountOut).div(new Big(10).pow(tokenOut.decimals)).toString(),
          pool: {
            ...swap.pool,
            tokenInSymbol: tokenIn.symbol,
            tokenOutSymbol: tokenOut.symbol,
          }
        };
      })
    );

    return {
      payload: swapsWithTokenInfo,
      pagination: swaps.pagination,
    };
  }

  async getTopActivePools(
    chainId: number,
    version?: VersionEnum,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const activePools = await this.swapProvider.getTopActivePools(
      chainId,
      version,
      limit,
      startDate,
      endDate
    );

    const activePoolsWithTokenInfo = await Promise.all(
      activePools.map(async (pool) => {
        const { token0, token1 } = await this.UniswapContractExternalService.getPoolTokens(pool.poolAddress);

        return {
          ...pool,
          poolTokens: token0 + '/' + token1,
        };
      })
    );

    return activePoolsWithTokenInfo;
  }

  async getTopActiveAddresses(
    chainId: number,
    version?: VersionEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const activePools = await this.swapProvider.getTopActiveAddresses(
      chainId,
      version,
      startDate,
      endDate
    );
    return activePools;
  }

  async getDailyPriceOfPool(
    chainId: number,
    poolAddress: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {

    const dailyPriceOfPool = await this.swapProvider.getDailyPriceOfPool(
      chainId,
      poolAddress,
      startDate,
      endDate
    );
    return dailyPriceOfPool;
  }

  async getPriceOfPair(
    chainId: number,
    token0: string,
    token1: string,
    timeframe: TimeframeEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const priceOfPair = await this.swapProvider.getPriceOfPair(
      chainId,
      token0,
      token1,
      timeframe,
      startDate,
      endDate
    );
    return priceOfPair;
  }
}
