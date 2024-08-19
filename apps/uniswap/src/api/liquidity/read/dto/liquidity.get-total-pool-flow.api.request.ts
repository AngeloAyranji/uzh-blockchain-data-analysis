import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LiquidityGetTotalPoolFlowApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: string;

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