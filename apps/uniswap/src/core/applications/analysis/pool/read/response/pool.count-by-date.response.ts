import { VersionEnum } from "../../../../../domains/analysis/factory";

export class PoolCountByDateResponse {
    chainId: number;
    version: VersionEnum;
    totalCount: number;
    date: Date;
    poolCountDateEnum: PoolCountDateEnum;
}

export enum PoolCountDateEnum {
    day = 'day',
    week = 'week',
    month = 'month',
}