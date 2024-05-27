
import { $Enums, Pool } from '@prisma/client-uniswap';

export class PoolEntity implements Pool {
  poolAddress: string;
  factoryAddress: string;
  token0: string;
  token1: string;
  deployedAt: Date;
}