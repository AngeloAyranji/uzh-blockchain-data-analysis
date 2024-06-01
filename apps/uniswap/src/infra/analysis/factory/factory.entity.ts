import { $Enums, Factory } from '@prisma/client-uniswap';

export class FactoryEntity implements Factory {
  id: string;
  address: string;
  version: $Enums.Version;
  swapSignature: string;
  poolCreatedSignature: string;
  chainId: number;
  createdAt: Date;
  updatedAt: Date;
}
