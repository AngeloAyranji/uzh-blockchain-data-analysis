import { Swap } from "../../../../domains/analysis/swap";

export const SWAP_MODIFIER = 'SWAP_MODIFIER';

export interface ISwapModifier {
    createMany(swaps: Swap[]): Promise<void>;
}