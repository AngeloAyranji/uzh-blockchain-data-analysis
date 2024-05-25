export class Factory {
    address: string;
    version: VersionEnum;
    swapSignature: string;
    poolCreatedSignature: string;
    chainId: number;
}

export enum VersionEnum {
    V2 = 'V2',
    V3 = 'V3',
}