import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SwapGetDistinctUsersByDateApiRequest {
  @IsNotEmpty()
  @IsString()
  chainId: Date;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}