import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { VersionEnum } from "../../../../core/domains/analysis/factory";

export class SwapGetActiveAddressesApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: number;

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(VersionEnum)
    version?: VersionEnum;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}