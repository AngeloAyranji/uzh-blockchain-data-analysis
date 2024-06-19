import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SwapGetAllWithPaginationApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsOptional()
    @IsString()
    poolId?: string;

    @IsOptional()
    @IsString()
    token?: string;

    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @IsNotEmpty()
    @IsNumber()
    page = 1;

    @IsNotEmpty()
    @IsNumber()
    limit = 20;
}