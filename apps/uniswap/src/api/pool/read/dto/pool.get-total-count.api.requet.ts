import { IsNumber, IsNotEmpty } from "class-validator";

export class PoolGetTotalCountApiRequest {
  @IsNotEmpty()
  @IsNumber()
  chainId: number;
}