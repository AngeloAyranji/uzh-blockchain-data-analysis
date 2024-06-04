import {
    Controller,
    Inject,
    UseInterceptors,
    Get,
    Query,
  } from '@nestjs/common';
import { ResponseTransformInterceptor } from '../../interceptors/response-transform.interceptor';
import {
    ISwapReadService,
    SWAP_READ_SERVICE,
} from '../../../core/applications/analysis/swap/read/iswap.read.service';
import { SwapGetAllWithPaginationApiRequest } from './dto/swap.get-all-with-pagination.api.request';
import { ISwapControllerReadMapper, SWAP_CONTROLLER_READ_MAPPER } from './mapper/iswap.read.mapper';
import { SwapGetAllWithPaginationApiResponse } from './dto/swap.get-all-with-pagination.api.response';
import { SwapGetActivePoolsApiRequest } from './dto/swap.get-active-pools.api.request';
import { SwapGetActivePoolsApiResponse } from './dto/swap.get-active-pools.api.response';

@UseInterceptors(ResponseTransformInterceptor)
@Controller('swap')
export class SwapReadController {
    constructor(
        @Inject(SWAP_READ_SERVICE)
        private readonly swapReadService: ISwapReadService,

        @Inject(SWAP_CONTROLLER_READ_MAPPER)
        private readonly swapControllerReadMapper: ISwapControllerReadMapper,
    ) {}

    @Get('/all')
    async getAllSwaps(@Query() query: SwapGetAllWithPaginationApiRequest): Promise<SwapGetAllWithPaginationApiResponse> {
        const response = await this.swapReadService.findSwapsWithPagination(Number(query.chainId), Number(query.page), Number(query.limit));
        return this.swapControllerReadMapper.mapPaginatedSwapsToPaginatedSwapsApiResponse(response);
    }

    @Get('/active-pools')
    async getTopActivePools(@Query() query: SwapGetActivePoolsApiRequest): Promise<SwapGetActivePoolsApiResponse[]> {
        const response = await this.swapReadService.getTopActivePools(Number(query.chainId), query.version);
        return this.swapControllerReadMapper.mapTopActivePoolsToTopActivePoolsApiResponse(response);
    }
}