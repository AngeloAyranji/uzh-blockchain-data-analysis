import { Inject, Injectable } from '@nestjs/common';
import { ISwapReadService } from './iswap.read.service';
import { ISwapProvider, SWAP_PROVIDER } from './iswap.provider.service';
import { Swap } from '../../../../../core/domains/analysis/swap';
import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';

@Injectable()
export class SwapReadService implements ISwapReadService {
  constructor(
    @Inject(SWAP_PROVIDER)
    private readonly swapProvider: ISwapProvider
  ) {}

  async findSwapsWithPagination(
    chainId: number,
    page: number,
    limit: number
  ): Promise<PaginationContext<Swap>> {
    return this.swapProvider.findSwapsWithPagination(chainId, page, limit);
  }

  async getTopActivePools(
    chainId: number,
    version?: VersionEnum
  ): Promise<any> {
    const activePools = await this.swapProvider.getTopActivePools(
      chainId,
      version
    );
    return activePools;
  }

  async getTopActiveAddresses(
    chainId: number,
    version?: VersionEnum
  ): Promise<any> {
    const activePools = await this.swapProvider.getTopActiveAddresses(
      chainId,
      version
    );
    return activePools;
  }
}
