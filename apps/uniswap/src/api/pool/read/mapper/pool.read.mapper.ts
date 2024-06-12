import { Injectable } from '@nestjs/common';
import { IPoolControllerReadMapper } from './ipool.read.mapper';
import { PoolTotalCountApiResponse } from '../dto/pool.get-total-count.api.response';
import { PoolTotalCountResponse } from '../../../../core/applications/analysis/pool/read/response/pool.total-count.response';
import { PoolTokensWithMostPoolsResponse } from '../../../../core/applications/analysis/pool/read/response/pool.tokens-with-most-pools.response';
import { PoolTokensWithMostPoolsApiResponse } from '../dto/pool.get-most-tokens-pools.api.response';
import { PoolCountByDateResponse } from '../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response';
import { PoolCountByDateApiResponse } from '../dto/pool.count-by-date.api.response';

@Injectable()
export class PoolControllerReadMapper implements IPoolControllerReadMapper {
  mapTotalCountToTotalCountApiResponse(
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

  mapTokensMostPoolsToTokensMostPoolsApiResponse(
    response: PoolTokensWithMostPoolsResponse[]
  ): PoolTokensWithMostPoolsApiResponse[] {
    return response.map((res) => {
      return {
        token: res.token,
        count: res.count,
        percentage: res.percentage,
      };
    });
  }

  mapPoolCountByDateToPoolCountByDateApiResponse(
    response: PoolCountByDateResponse[]
  ): PoolCountByDateApiResponse[] {
    return response.map((res) => {
      return {
        totalCountV2: Number(res.totalCountV2),
        totalCountV3: Number(res.totalCountV3),
        date: res.date,
      };
    });
  }
}
