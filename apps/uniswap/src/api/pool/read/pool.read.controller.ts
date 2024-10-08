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
  IPoolReadService,
  POOL_READ_SERVICE,
} from '../../../core/applications/analysis/pool/read/ipool.read.service';
import { PoolGetTotalCountApiRequest } from './dto/pool.get-total-count.api.requet';
import { IPoolControllerReadMapper, POOL_CONTROLLER_READ_MAPPER } from './mapper/ipool.read.mapper';
import { PoolTotalCountApiResponse } from './dto/pool.get-total-count.api.response';
import { PoolGetTokensWithMostPoolsApiRequest } from './dto/pool.get-most-tokens-pools.api.request';
import { PoolCountByDateApiRequest } from './dto/pool.count-by-date.api.request';
import { PoolTokensWithMostPoolsApiResponse } from './dto/pool.get-most-tokens-pools.api.response';
import { PoolCountByDateApiResponse } from './dto/pool.count-by-date.api.response';

@UseInterceptors(ResponseTransformInterceptor, CacheInterceptor)
@Controller('pool')
export class PoolReadController {
  constructor(
    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(POOL_CONTROLLER_READ_MAPPER)
    private readonly poolControllerReadMapper: IPoolControllerReadMapper,
  ) {}

  @CacheTTL(600)
  @Get('/count')
  async getTotalCount(@Query() query: PoolGetTotalCountApiRequest): Promise<PoolTotalCountApiResponse[]> {
    const response = await this.poolReadService.getTotalCount(Number(query.chainId), query.version);
    return this.poolControllerReadMapper.mapTotalCountToTotalCountApiResponse(response);
  }
  
  @CacheTTL(600)
  @Get('/top-tokens')
  async getTokensWithMostPools(@Query() query: PoolGetTokensWithMostPoolsApiRequest): Promise<PoolTokensWithMostPoolsApiResponse[]> {
    const response = await this.poolReadService.getTokensWithMostPools(Number(query.chainId), query.version);
    return this.poolControllerReadMapper.mapTokensMostPoolsToTokensMostPoolsApiResponse(response);
  }

  @CacheTTL(600)
  @Get('/count-by-date')
  async getPoolCountByDate(@Query() query: PoolCountByDateApiRequest): Promise<PoolCountByDateApiResponse[]> {
    const response = await this.poolReadService.getPoolCountByDate(Number(query.chainId), query.date, query.version, query.startDate, query.endDate);
    return this.poolControllerReadMapper.mapPoolCountByDateToPoolCountByDateApiResponse(response);
  }
}
