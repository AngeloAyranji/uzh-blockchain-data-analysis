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
  ILiquidityReadService,
  LIQUIDITY_READ_SERVICE,
} from '../../../core/applications/analysis/liquidity/read/iliquidity.read.service';
import {
  ILiquidityControllerReadMapper,
  LIQUIDITY_CONTROLLER_READ_MAPPER,
} from './mapper/iliquidity.read.mapper';
import { LiquidityGetActiveProvidersByPoolApiRequest } from './dto/liquidity.get-active-providers-by-pool.api.request';
import { LiquidityGetActiveProvidersByPoolApiResponse } from './dto/liquidity.get-active-providers-by-pool.api.response';
import { LiquidityGetPoolFlowApiRequest } from './dto/liquidity.get-pool-flow.api.request';
import { LiquidityGetPoolFlowApiResponse } from './dto/liquidity.get-pool-flow.api.response';
import { LiquidityGetTotalPoolFlowApiRequest } from './dto/liquidity.get-total-pool-flow.api.request';
import { LiquidityGetTotaltPoolFlowApiResponse } from './dto/liquidity.get-total-pool-flow.api.response';

@UseInterceptors(ResponseTransformInterceptor, CacheInterceptor)
@Controller('liquidity')
export class LiquidityReadController {
  constructor(
    @Inject(LIQUIDITY_READ_SERVICE)
    private readonly liquidityReadService: ILiquidityReadService,

    @Inject(LIQUIDITY_CONTROLLER_READ_MAPPER)
    private readonly liquidityControllerReadMapper: ILiquidityControllerReadMapper
  ) { }

  @CacheTTL(600)
  @Get('/active-providers-by-pool')
  async getActiveProvidersByPool(
    @Query() query: LiquidityGetActiveProvidersByPoolApiRequest
  ): Promise<LiquidityGetActiveProvidersByPoolApiResponse[]> {
    const response =
      await this.liquidityReadService.getTopActiveLiquidityProvidersByPool(
        Number(query.chainId),
        query.poolAddress,
        query.limit,
        query.startDate,
        query.endDate
      );
    return this.liquidityControllerReadMapper.mapActiveProvidersByPoolToApiResponse(
      response
    );
  }

  @CacheTTL(600)
  @Get('/pool-flow')
  async getPoolFlow(
    @Query() query: LiquidityGetPoolFlowApiRequest
  ): Promise<LiquidityGetPoolFlowApiResponse[]> {
    const response = await this.liquidityReadService.getPoolflow(
      Number(query.chainId),
      query.poolAddress,
      query.type,
      query.startDate,
      query.endDate
    );

    return this.liquidityControllerReadMapper.mapPoolFlowToApiResponse(response);
  }

  @CacheTTL(600)
  @Get('/pool-total-flow')
  async getTotalPoolFlow(
    @Query() query: LiquidityGetTotalPoolFlowApiRequest
  ): Promise<LiquidityGetTotaltPoolFlowApiResponse[]> {
    const response = await this.liquidityReadService.getPoolTotalFlow(
      Number(query.chainId),
      query.poolAddress,
      query.startDate,
      query.endDate
    );

    return this.liquidityControllerReadMapper.mapTotalPoolFlowToApiResponse(response);
  }
}
