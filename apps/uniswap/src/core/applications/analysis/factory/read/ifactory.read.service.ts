import { Factory } from "../../../../domains/analysis/factory";

export const FACTORY_READ_SERVICE = 'FACTORY_READ_SERVICE';

export interface IFactoryReadService {
    findAllByChainId(chainId: number): Promise<Factory[]>;
    findByAddressAndChainId(factoryAddress: string, chainId: number): Promise<Factory>;
}