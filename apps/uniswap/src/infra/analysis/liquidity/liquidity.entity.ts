import { Liquidity } from '@prisma/client-uniswap';
import { LiquidityTypeEnum } from '../../../core/domains/analysis/liquidity';

export class LiquidityEntity implements Liquidity {
  id: string;
  poolId: string;
  transactionHash: string;
  owner: string;
  amount0: string;
  amount1: string;
  type: LiquidityTypeEnum;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
