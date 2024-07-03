import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SwapGetSwapsByPoolAddressApiRequest {
    @IsNotEmpty()
    @IsString()
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