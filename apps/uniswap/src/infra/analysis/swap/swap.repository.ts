import { Inject, Injectable } from "@nestjs/common";
import { ISwapModifier } from "../../../core/applications/analysis/swap/write/iswap.modifier";
import { ISwapMapper, SWAP_MAPPER } from "./mapper/iswap.mapper";
import { UniswapDbHandler } from "../../db/uniswap-db.handler";
import { Swap } from "../../../core/domains/analysis/swap";
import { ISwapProvider } from "../../../core/applications/analysis/swap/read/iswap.provider.service";

@Injectable()
export class SwapRepository implements ISwapModifier, ISwapProvider {
    constructor(
        @Inject(SWAP_MAPPER)
        private readonly swapMapper: ISwapMapper,
        private readonly uniswapDbHandler: UniswapDbHandler
    ) { }

    async createMany(swaps: Swap[]): Promise<void> {
        const entities = this.swapMapper.mapDomainsToEntities(swaps);
        await this.uniswapDbHandler.swap.createMany({
            data: entities,
        });
    }
}