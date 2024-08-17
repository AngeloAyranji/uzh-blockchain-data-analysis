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

@UseInterceptors(ResponseTransformInterceptor, CacheInterceptor)
@Controller('liquidity')
export class LiquidityReadController {
  constructor(
    @Inject(LIQUIDITY_READ_SERVICE)
    private readonly liquidityReadService: ILiquidityReadService,

    @Inject(LIQUIDITY_CONTROLLER_READ_MAPPER)
    private readonly liquidityControllerReadMapper: ILiquidityControllerReadMapper
  ) {}
}
