import { Pool } from '@prisma/client-uniswap';

export class PoolEntity implements Pool {
  id: string;
  poolAddress: string;
  factoryId: string;
  token0Id: string;
  token1Id: string;
  deployedAt: Date;
}