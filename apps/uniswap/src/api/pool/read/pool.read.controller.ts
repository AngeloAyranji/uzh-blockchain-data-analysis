import {
  Controller,
  Inject,
  UseInterceptors,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ResponseTransformInterceptor } from '../../interceptors/response-transform.interceptor';
import {
  IPoolReadService,
  POOL_READ_SERVICE,
} from '../../../core/applications/analysis/pool/read/ipool.read.service';
import { PoolGetTotalCountApiRequest } from './dto/pool.get-total-count.api.requet';
import { IPoolControllerReadMapper, POOL_CONTROLLER_READ_MAPPER } from './mapper/ipool.read.mapper';
import { PoolTotalCountApiResponse } from './dto/pool.get-total-count.api.response';
import { PoolGetTokensWithMostPoolsApiRequest } from './dto/pool.get-most-tokens-pools.api.request';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('pool')
export class PoolReadController {
  constructor(
    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(POOL_CONTROLLER_READ_MAPPER)
    private readonly poolControllerReadMapper: IPoolControllerReadMapper,
  ) {}

  @Get('/count')
  async getTotalCount(@Query() query: PoolGetTotalCountApiRequest): Promise<PoolTotalCountApiResponse[]> {
    const response = await this.poolReadService.getTotalCount(Number(query.chainId), query.version);
    return this.poolControllerReadMapper.mapTotalCountToTotalCountApiResponse(response);
  }

  @Get('/top-tokens')
  async getTokensWithMostPools(@Query() query: PoolGetTokensWithMostPoolsApiRequest): Promise<any> {
    const response = await this.poolReadService.getTokensWithMostPools(Number(query.chainId), query.version);
    return this.poolControllerReadMapper.mapTokensMostPoolsToTokensMostPoolsApiResponse(response);
  }
}
