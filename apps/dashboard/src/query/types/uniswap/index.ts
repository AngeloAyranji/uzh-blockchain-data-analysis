export interface PoolTokensWithMostPools {
  token: string;
  count: number;
  percentage: number;
  symbol: string;
}

export interface PoolTotalCount {
  totalCount: number;
  factoryAddress: string;
  factoryVersion: string;
}

export interface PoolCreatedByDate {
  totalCountV2: number;
  totalCountV3?: number;
  date: Date;
}

export interface LatestSwaps {
  id: string;
  poolAddress: string;
  transactionHash: string;
  sender: string;
  recipient: string;
  amountIn: string;
  amountOut: string;
  reversed: boolean;
  timestamp: Date;
  page: number;
  limit: number;
}

export interface TopActivePools {
  poolAddress: string;
  count: number;
  percentage: number;
  poolTokens: string;
}

export interface TopActiveAddresses {
  address: string;
  count: number;
  percentage: number;
}

export interface PoolPriceAndVolume {
  price: number;
  volume: number;
  time: Date;
}

export interface Activity {
  swaps: Swap[];
  pagination: PaginationModel;
}

export interface PaginationModel {
  totalCount: number;
  page: number;
  limit: 3;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Swap {
  transactionHash: string;
  amountIn: string;
  amoutOut: string;
  swapAt: string;
  pool: {
    tokenIn: string;
    tokenOut: string;
    factory: {
      version: Version;
    }
  }
}

export type Version = "V2" | "V3" | undefined;

export enum DateEnum {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}