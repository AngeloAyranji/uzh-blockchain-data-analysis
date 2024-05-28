import { Inject, Injectable } from "@nestjs/common";
import { ISwapReadService } from "./iswap.read.service";
import { ISwapProvider, SWAP_PROVIDER } from "./iswap.provider.service";

@Injectable()
export class SwapReadService implements ISwapReadService {
    constructor(
        @Inject(SWAP_PROVIDER)
        private readonly swapProvider: ISwapProvider,
    ) {}
}