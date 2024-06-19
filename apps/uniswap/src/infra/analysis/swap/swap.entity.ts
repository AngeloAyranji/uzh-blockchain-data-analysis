import { Swap } from '@prisma/client-uniswap';

export class SwapEntity implements Swap {
  id: string;
  poolId: string;
  transactionHash: string;
  sender: string;
  recipient: string;
  amountIn: string;
  amountOut: string;
  reversed: boolean;
  price: string | null;
  swapAt: Date;
  createdAt: Date;
  updatedAt: Date;
}