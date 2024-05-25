import { Factory } from "../../../domains/factory";

export const FACTORY_PROVIDER = 'FACTORY_PROVIDER';

export interface IFactoryProvider {
    findAllByChainId(chainId: number): Promise<Factory[]>;
}