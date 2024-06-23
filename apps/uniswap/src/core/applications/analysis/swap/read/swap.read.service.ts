import { Inject, Injectable } from '@nestjs/common';
import { ISwapReadService } from './iswap.read.service';
import { ISwapProvider, SWAP_PROVIDER } from './iswap.provider.service';
import { PaginationContext } from '../../../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../../../core/domains/analysis/factory';
import { IPoolReadService, POOL_READ_SERVICE } from '../../pool/read/ipool.read.service';
import { SwapCriteriaRequest } from './requests/swap.criteria.request';
import { SwapCriteriaResponse } from './requests/swap.criteria.response';
import { IUniswapContractExternalService, UNISWAP_CONTRACT_EXTERNAL_SERVICE } from '../../../../../external/uniswap-contract/iuniswap-contract.external.service';

@Injectable()
export class SwapReadService implements ISwapReadService {
  constructor(
    @Inject(SWAP_PROVIDER)
    private readonly swapProvider: ISwapProvider,

    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(UNISWAP_CONTRACT_EXTERNAL_SERVICE)
    private readonly UniswapContractExternalService: IUniswapContractExternalService,
  ) {}

  async findSwapsWithPagination(swapCriteriaRequest: SwapCriteriaRequest): Promise<PaginationContext<SwapCriteriaResponse>> {
    return this.swapProvider.findSwapsWithPagination(swapCriteriaRequest);
  }

  async getTopActivePools(
    chainId: number,
    version?: VersionEnum
  ): Promise<any> {
    const activePools = await this.swapProvider.getTopActivePools(
      chainId,
      version
    );

    const activePoolsWithTokenInfo = await Promise.all(
      activePools.map(async (pool) => {
        const { token0, token1 } = await this.UniswapContractExternalService.getPoolTokens(pool.poolAddress);

        return {
          ...pool,
          poolTokens: token0 + '/' + token1,
        };
      })
    );

    return activePoolsWithTokenInfo;
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
