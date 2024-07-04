import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';
import { SwapCriteriaRequest } from './requests/swap.criteria.request';
import { SwapCriteriaResponse } from './requests/swap.criteria.response';
import { TimeframeEnum } from '../../../../../core/domains/analysis/swap';

export const SWAP_PROVIDER = 'SWAP_PROVIDER';

export interface ISwapProvider {
  findSwapsWithPagination(swapCriteriaRequest: SwapCriteriaRequest): Promise<PaginationContext<SwapCriteriaResponse>>;
  getTopActivePools(chainId: number, version?: VersionEnum, limit?: number, startDate?: Date, endDate?: Date): Promise<any>;
  getTopActiveAddresses(chainId: number, version?: VersionEnum, startDate?: Date, endDate?: Date): Promise<any>;
  getDailyPriceOfPool(chainId: number, poolAddress: string, startDate?: Date, endDate?: Date): Promise<any>;
  getSwapsByPoolAddress(chainId: number, poolAddress: string, startDate?: Date, endDate?: Date): Promise<any>;
  getPriceOfPair(
    chainId: number,
    token0: string,
    token1: string,
    timeframe: TimeframeEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any>;
  getNewUsersByDate(chainId: number, startDate?: Date, endDate?: Date): Promise<any>;
}
