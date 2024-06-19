import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { Swap } from '../../../../../core/domains/analysis/swap';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';
import { SwapCriteriaRequest } from './requests/swap.criteria.request';

export const SWAP_PROVIDER = 'SWAP_PROVIDER';

export interface ISwapProvider {
  findSwapsWithPagination(swapCriteriaRequest: SwapCriteriaRequest): Promise<PaginationContext<Swap>>;
  getTopActivePools(chainId: number, version?: VersionEnum): Promise<any>;
  getTopActiveAddresses(chainId: number, version?: VersionEnum): Promise<any>;
  getDailyPriceOfPool(chainId: number, poolAddress: string): Promise<any>;
}
