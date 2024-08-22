import { TimeframeEnum } from "apps/uniswap/src/core/domains/analysis/swap";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SwapGetDistinctUsersByDateApiRequest {
  @IsNotEmpty()
  @IsString()
  chainId: Date;

  @IsOptional()
  @IsEnum(TimeframeEnum)
  timeframe?: TimeframeEnum;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}