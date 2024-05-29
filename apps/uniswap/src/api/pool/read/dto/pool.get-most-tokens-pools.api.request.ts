import { IsNumber, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { Type } from 'class-transformer';
import { VersionEnum } from "../../../../core/domains/analysis/factory";

export class PoolGetTokensWithMostPoolsApiRequest {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  chainId: number;

  @IsOptional()
  @IsEnum(VersionEnum)
  version?: VersionEnum;
}