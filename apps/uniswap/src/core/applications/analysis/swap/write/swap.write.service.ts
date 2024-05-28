import { Inject, Injectable } from "@nestjs/common";
import { ISwapWriteService } from "./iswap.write.service";
import { ISwapModifier, SWAP_MODIFIER } from "./iswap.modifier";
import { SwapAddRequest } from "./request/swap.add.request";
import { ISwapRequestMapper, SWAP_REQUEST_MAPPER } from "./mapper/iswap.request.mapper";

@Injectable()
export class SwapWriteService implements ISwapWriteService {

    constructor(
        @Inject(SWAP_MODIFIER)
        private readonly swapModifier: ISwapModifier,

        @Inject(SWAP_REQUEST_MAPPER)
        private readonly swapRequestMapper: ISwapRequestMapper
    ) { }

    async addMany(swapAddRequests: SwapAddRequest[]): Promise<void> {
        const swaps = this.swapRequestMapper.mapSwapAddRequestsToDomains(swapAddRequests);
        await this.swapModifier.createMany(swaps);
    }
}