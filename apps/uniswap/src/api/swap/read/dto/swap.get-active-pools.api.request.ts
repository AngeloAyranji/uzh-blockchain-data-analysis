import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { VersionEnum } from "../../../../core/domains/analysis/factory";

export class SwapGetActivePoolsApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: number;

    @IsOptional()
    @IsEnum(VersionEnum)
    version?: VersionEnum;

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