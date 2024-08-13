export class Factory {
    id: string;
    address: string;
    version: VersionEnum;
    poolCreatedSignature: string;
    swapSignature: string;
    mintSignature: string;
    burnSignature: string;
    chainId: number;
}

export enum VersionEnum {
    V2 = 'V2',
    V3 = 'V3',
}