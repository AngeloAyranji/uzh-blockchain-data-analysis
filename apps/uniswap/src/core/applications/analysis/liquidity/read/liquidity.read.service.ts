import { Inject, Injectable } from '@nestjs/common';
import { ArithmeticService } from '@uzh/arithmetic';
import Big from 'big.js';
import { ILiquidityReadService } from './iliquidity.read.service';
import { ILiquidityProvider, LIQUIDITY_PROVIDER } from './iliquidity.provider';
import { IUniswapContractExternalService, UNISWAP_CONTRACT_EXTERNAL_SERVICE } from '../../../../../external/uniswap-contract/iuniswap-contract.external.service';
import { LiquidityTypeEnum } from '../../../..//domains/analysis/liquidity';
import { IPoolReadService, POOL_READ_SERVICE } from '../../pool/read/ipool.read.service';

@Injectable()
export class LiquidityReadService implements ILiquidityReadService {
  constructor(
    @Inject(LIQUIDITY_PROVIDER)
    private readonly liquidityProvider: ILiquidityProvider,

    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(UNISWAP_CONTRACT_EXTERNAL_SERVICE)
    private readonly uniswapContractExternalService: IUniswapContractExternalService,

    private readonly arithmeticService: ArithmeticService
  ) { }

  async getTopActiveLiquidityProvidersByPool(
    chainId: number,
    poolAddress: string,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    return await this.liquidityProvider.getTopActiveLiquidityProvidersByPool(chainId, poolAddress, limit, startDate, endDate);
  }

  async getPoolflow(
    chainId: number,
    poolAddress: string,
    type: LiquidityTypeEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const liquidities = await this.liquidityProvider.getPoolFlow(chainId, poolAddress, type, startDate, endDate);

    const tokens = await this.poolReadService.getTokensOfPool(chainId, poolAddress);

    const [token0Info, token1Info] = await Promise.all([
      this.uniswapContractExternalService.getDecimalsAndSymbol(tokens[0]),
      this.uniswapContractExternalService.getDecimalsAndSymbol(tokens[1])
    ]);

    const decimal0 = new Big(10).pow(token0Info.decimals);
    const decimal1 = new Big(10).pow(token1Info.decimals);

    const dailyTotals = new Map<string, { amount0: Big, amount1: Big }>();

    liquidities.forEach(liquidity => {
      const dateKey = liquidity.timestamp.toISOString().split('T')[0]; // Extract date part

      const amount0 = new Big(liquidity.amount0).div(decimal0);
      const amount1 = new Big(liquidity.amount1).div(decimal1);

      if (dailyTotals.has(dateKey)) {
        const existing = dailyTotals.get(dateKey);
        existing.amount0 = existing.amount0.plus(amount0);
        existing.amount1 = existing.amount1.plus(amount1);
      } else {
        dailyTotals.set(dateKey, { amount0, amount1 });
      }
    });

    return Array.from(dailyTotals.entries()).map(([date, { amount0, amount1 }]) => ({
      date,
      amount0: amount0.toString(),
      amount1: amount1.toString()
    }));
  }

  async getPoolTotalFlow(
    chainId: number,
    poolAddress: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const addFlow = await this.getPoolflow(chainId, poolAddress, LiquidityTypeEnum.ADD, startDate, endDate);
    const removeFlow = await this.getPoolflow(chainId, poolAddress, LiquidityTypeEnum.REMOVE, startDate, endDate);

    const totalFlowMap = new Map<string, { amount0: Big, amount1: Big }>();

    const updateTotalFlow = (flowData, isAddFlow) => {
      flowData.forEach(({ date, amount0, amount1 }) => {
        const amount0Big = new Big(amount0);
        const amount1Big = new Big(amount1);

        if (totalFlowMap.has(date)) {
          const existing = totalFlowMap.get(date);
          existing.amount0 = isAddFlow
            ? existing.amount0.plus(amount0Big)
            : existing.amount0.minus(amount0Big);
          existing.amount1 = isAddFlow
            ? existing.amount1.plus(amount1Big)
            : existing.amount1.minus(amount1Big);
        } else {
          totalFlowMap.set(date, {
            amount0: isAddFlow ? amount0Big : amount0Big.neg(),
            amount1: isAddFlow ? amount1Big : amount1Big.neg(),
          });
        }
      });
    };

    updateTotalFlow(addFlow, true);
    updateTotalFlow(removeFlow, false);

    return Array.from(totalFlowMap.entries()).map(([date, { amount0, amount1 }]) => ({
      date,
      amount0: amount0.toString(),
      amount1: amount1.toString()
    }));
  }
}