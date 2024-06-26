import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SwapGetPriceApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}