import { Liquidity } from "../../../../domains/analysis/liquidity";

export const LIQUIDITY_MODIFIER = 'LIQUIDITY_MODIFIER';

export interface ILiquidityModifier {
    createMany(liquidity: Liquidity[]): Promise<void>;
}