import {
  Controller,
  Inject,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { ResponseTransformInterceptor } from '../../interceptors/response-transform.interceptor';
import {
  IPoolReadService,
  POOL_READ_SERVICE,
} from '../../../core/applications/analysis/pool/read/ipool.read.service';
import { PoolGetTotalCountApiRequest } from './dto/pool.get-total-count.api.requet';
import { IPoolControllerReadMapper, POOL_CONTROLLER_READ_MAPPER } from './mapper/ipool.read.mapper';
import { PoolTotalCountApiResponse } from './dto/pool.get-total-count.api.response';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('pool')
export class PoolReadController {
  constructor(
    @Inject(POOL_READ_SERVICE)
    private readonly poolReadService: IPoolReadService,

    @Inject(POOL_CONTROLLER_READ_MAPPER)
    private readonly poolControllerReadMapper: IPoolControllerReadMapper,
  ) {}

  @Get('/count/:chainId')
  async getTotalCount(@Param() params: PoolGetTotalCountApiRequest): Promise<PoolTotalCountApiResponse[]> {
    const response = await this.poolReadService.getTotalCount(Number(params.chainId));
    return this.poolControllerReadMapper.mapTotalCountToToalCountApiResponse(response);
  }
}
