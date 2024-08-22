import { TimeframeEnum } from "../../../../core/domains/analysis/swap";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SwapGetSwapsByPoolAddressApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;

    @IsOptional()
    @IsEnum(TimeframeEnum)
    timeframe?: TimeframeEnum

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}