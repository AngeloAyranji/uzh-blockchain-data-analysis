import { Injectable } from '@nestjs/common';
import { IPoolControllerReadMapper } from './ipool.read.mapper';
import { PoolTotalCountApiResponse } from '../dto/pool.get-total-count.api.response';
import { PoolTotalCountResponse } from '../../../../core/applications/analysis/pool/read/response/pool.total-count.response';

@Injectable()
export class PoolControllerReadMapper implements IPoolControllerReadMapper {
  mapTotalCountToToalCountApiResponse(
    response: PoolTotalCountResponse[]
  ): PoolTotalCountApiResponse[] {
    return response.map((res) => {
      return {
        totalCount: res.totalCount,
        factoryAddress: res.factoryAddress,
        factoryVersion: res.factoryVersion,
      };
    });
  }
}
