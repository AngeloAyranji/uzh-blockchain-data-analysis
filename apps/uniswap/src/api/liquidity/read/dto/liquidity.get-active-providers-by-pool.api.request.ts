import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LiquidityGetActiveProvidersByPoolApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}