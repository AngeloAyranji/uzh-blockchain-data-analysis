import { Inject, Injectable } from '@nestjs/common';
import { ISwapReadService } from './iswap.read.service';
import { ISwapProvider, SWAP_PROVIDER } from './iswap.provider.service';
import { Swap } from '../../../../../core/domains/analysis/swap';
import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';
import { IPoolReadService, POOL_READ_SERVICE } from '../../pool/read/ipool.read.service';

@Injectable()
export class SwapReadService implements ISwapReadService {
  constructor(
    @Inject(SWAP_PROVIDER)
    private readonly swapProvider: ISwapProvider,

    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService
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

  async getDailyPriceOfPool(
    chainId: number,
    poolAddress: string
  ): Promise<any> {
    const poolExists = await this.poolReadService.checkIfPoolIsVersion(chainId, poolAddress, VersionEnum.V3);

    if (!poolExists) {
      throw new Error('Pool does not exist');
    }

    const dailyPriceOfPool = await this.swapProvider.getDailyPriceOfPool(
      chainId,
      poolAddress
    );
    return dailyPriceOfPool;
  }
}
