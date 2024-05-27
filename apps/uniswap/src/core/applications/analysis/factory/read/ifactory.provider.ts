import { Factory } from "../../../../domains/analysis/factory";

export const FACTORY_PROVIDER = 'FACTORY_PROVIDER';

export interface IFactoryProvider {
    findAllByChainId(chainId: number): Promise<Factory[]>;
    findByAddress(factoryAddress: string): Promise<Factory>;
}