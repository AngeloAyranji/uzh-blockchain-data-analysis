import { VersionEnum } from "../../../../../domains/analysis/factory";

export class PoolCountByDateResponse {
    totalCountV2: bigint;
    totalCountV3: bigint;
    date: string;
}

export enum PoolCountDateEnum {
    day = 'day',
    week = 'week',
    month = 'month',
}