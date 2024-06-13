import { Pool } from '@prisma/client-uniswap';

export class PoolEntity implements Pool {
  id: string;
  poolAddress: string;
  factoryId: string;
  token0: string;
  token1: string;
  deployedAt: Date;
}