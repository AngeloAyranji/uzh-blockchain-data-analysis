import { LiquidityAddRequest } from "./request/liquidity.add.request";

export const LIQUIDITY_WRITE_SERVICE = 'LIQUIDITY_WRITE_SERVICE';

export interface ILiquidityWriteService {
    addMany(liquidityAddRequests: LiquidityAddRequest[]): Promise<void>;
}