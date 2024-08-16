import { Inject, Injectable } from "@nestjs/common";
import { ILiquidityWriteService } from "./iliquidity.write.service";
import { ILiquidityModifier, LIQUIDITY_MODIFIER } from "./iliquidity.modifier";
import { ILiquidityRequestMapper, LIQUIDITY_REQUEST_MAPPER } from "./mapper/iliquidity.request.mapper";
import { LiquidityAddRequest } from "./request/liquidity.add.request";

@Injectable()
export class LiquidityWriteService implements ILiquidityWriteService {
    constructor(
        @Inject(LIQUIDITY_MODIFIER)
        private readonly liquidityModifier: ILiquidityModifier,

        @Inject(LIQUIDITY_REQUEST_MAPPER)
        private readonly liquidityRequestMapper: ILiquidityRequestMapper
    ) {}

    async addMany(liquidityAddRequests: LiquidityAddRequest[]): Promise<void> {
        const liquidity = this.liquidityRequestMapper.mapAddRequestsToDomains(liquidityAddRequests);
        await this.liquidityModifier.createMany(liquidity);
    }
}