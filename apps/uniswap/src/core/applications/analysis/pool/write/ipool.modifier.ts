import { Pool } from '../../../../domains/analysis/pool';

export const POOL_MODIFIER = 'POOL_MODIFIER';

export interface IPoolModifier {
  createMany(pools: Pool[]): Promise<void>;
}
