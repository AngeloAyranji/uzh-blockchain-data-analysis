import { VersionEnum } from "../../../../core/domains/analysis/factory";
import { PoolCountDateEnum } from "../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response";
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class PoolCountByDateApiRequest {
    @IsNotEmpty()
    chainId: number;

    @IsNotEmpty()
    @IsEnum(PoolCountDateEnum)
    date: PoolCountDateEnum;

    @IsNotEmpty()
    @IsEnum(VersionEnum)
    version: VersionEnum;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;
}