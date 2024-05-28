import { $Enums, Swap } from '@prisma/client-uniswap';

export class SwapEntity implements Swap {
  id: string;
  poolAddress: string;
  transactionHash: string;
  sender: string;
  recipient: string;
  amountIn: string;
  amountOut: string;
  reversed: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}