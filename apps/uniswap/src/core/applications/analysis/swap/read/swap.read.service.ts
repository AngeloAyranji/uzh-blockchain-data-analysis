import { Inject, Injectable } from "@nestjs/common";
import { ISwapReadService } from "./iswap.read.service";
import { ISwapProvider, SWAP_PROVIDER } from "./iswap.provider.service";
import { Swap } from "../../../../../core/domains/analysis/swap";
import { PaginationContext } from "../../../../../core/domains/valueobject/paginationContext";

@Injectable()
export class SwapReadService implements ISwapReadService {
    constructor(
        @Inject(SWAP_PROVIDER)
        private readonly swapProvider: ISwapProvider,
    ) {}

    async findSwapsWithPagination(chainId: number, page: number, limit: number): Promise<PaginationContext<Swap>> {
        return this.swapProvider.findSwapsWithPagination(chainId, page, limit);
    }
}