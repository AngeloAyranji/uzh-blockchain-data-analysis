import { Liquidity } from "../../../../../domains/analysis/liquidity";
import { LiquidityAddRequest } from "../request/liquidity.add.request";

export const LIQUIDITY_REQUEST_MAPPER = 'LIQUIDITY_REQUEST_MAPPER';

export interface ILiquidityRequestMapper {
  mapAddRequestToDomain(request: LiquidityAddRequest): Liquidity
  mapAddRequestsToDomains(requests: LiquidityAddRequest[]): Liquidity[]
}