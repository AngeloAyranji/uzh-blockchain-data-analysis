import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TimeframeEnum } from "../../../../core/domains/analysis/swap";

export class SwapGetPriceApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;

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