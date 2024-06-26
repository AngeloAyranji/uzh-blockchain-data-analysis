import {
  Controller,
  Inject,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ResponseTransformInterceptor } from '../../interceptors/response-transform.interceptor';
import {
  ISwapReadService,
  SWAP_READ_SERVICE,
} from '../../../core/applications/analysis/swap/read/iswap.read.service';
import { SwapGetAllWithPaginationApiRequest } from './dto/swap.get-all-with-pagination.api.request';
import {
  ISwapControllerReadMapper,
  SWAP_CONTROLLER_READ_MAPPER,
} from './mapper/iswap.read.mapper';
import { SwapGetAllWithPaginationApiResponse } from './dto/swap.get-all-with-pagination.api.response';
import { SwapGetActivePoolsApiRequest } from './dto/swap.get-active-pools.api.request';
import { SwapGetActivePoolsApiResponse } from './dto/swap.get-active-pools.api.response';
import { SwapGetActiveAddressesApiResponse } from './dto/swap.get-active-addresses.api.response';
import { SwapGetActiveAddressesApiRequest } from './dto/swap.get-active-addresses.api.request';
import { SwapGetPriceApiRequest } from './dto/swap.get-price.api.request';
import { SwapGetPriceApiResponse } from './dto/swap.get-price.api.response';

@UseInterceptors(ResponseTransformInterceptor, CacheInterceptor)
@Controller('swap')
export class SwapReadController {
  constructor(
    @Inject(SWAP_READ_SERVICE)
    private readonly swapReadService: ISwapReadService,

    @Inject(SWAP_CONTROLLER_READ_MAPPER)
    private readonly swapControllerReadMapper: ISwapControllerReadMapper
  ) {}

  @CacheTTL(600)
  @Get('/all')
  async getAllSwaps(
    @Query() query: SwapGetAllWithPaginationApiRequest
  ): Promise<SwapGetAllWithPaginationApiResponse> {
    const response = await this.swapReadService.findSwapsWithPagination(
      this.swapControllerReadMapper.mapSwapGetAllWithPaginationApiRequestToSwapCriteriaRequest(
        query
      )
    );
    return this.swapControllerReadMapper.mapPaginatedSwapsToPaginatedSwapsApiResponse(
      response
    );
  }

  @CacheTTL(600)
  @Get('/active-pools')
  async getTopActivePools(
    @Query() query: SwapGetActivePoolsApiRequest
  ): Promise<SwapGetActivePoolsApiResponse[]> {
    const response = await this.swapReadService.getTopActivePools(
      Number(query.chainId),
      query.version
    );
    return this.swapControllerReadMapper.mapTopActivePoolsToTopActivePoolsApiResponse(
      response
    );
  }

  @CacheTTL(600)
  @Get('/active-addresses')
  async getTopActiveAddresses(
    @Query() query: SwapGetActiveAddressesApiRequest
  ): Promise<SwapGetActiveAddressesApiResponse[]> {
    const response = await this.swapReadService.getTopActiveAddresses(
      Number(query.chainId),
      query.version
    );
    return this.swapControllerReadMapper.mapTopActiveAddressesToTopActiveAddressesApiResponse(
      response
    );
  }

  @CacheTTL(600)
  @Get('/daily-price')
  async getDailyPriceOfPool(
    @Query() query: SwapGetPriceApiRequest
  ): Promise<SwapGetPriceApiResponse[]> {
    const response = await this.swapReadService.getDailyPriceOfPool(
      Number(query.chainId),
      query.poolAddress,
      query.startDate,
      query.endDate
    );
    return this.swapControllerReadMapper.mapPricetoPriceApiResponse(response);
  }
}
