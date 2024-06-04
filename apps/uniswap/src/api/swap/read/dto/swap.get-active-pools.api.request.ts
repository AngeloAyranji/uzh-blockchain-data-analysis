import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { VersionEnum } from "../../../../core/domains/analysis/factory";

export class SwapGetActivePoolsApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: number;

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(VersionEnum)
    version?: VersionEnum;
}