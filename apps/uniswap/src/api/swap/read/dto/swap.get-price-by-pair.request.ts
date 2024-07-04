import { TimeframeEnum } from "../../../../core/domains/analysis/swap";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SwapGetPriceByPairApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    token0: string;

    @IsNotEmpty()
    @IsString()
    token1: string;

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