import { LiquidityTypeEnum } from "../../../../core/domains/analysis/liquidity";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LiquidityGetPoolFlowApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: string;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;

    @IsNotEmpty()
    @IsEnum(LiquidityTypeEnum)
    type: LiquidityTypeEnum;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}