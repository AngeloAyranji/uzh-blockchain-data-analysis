import { IsNotEmpty, IsString } from "class-validator";

export class SwapGetSwapsByPoolAddressApiRequest {
    @IsNotEmpty()
    @IsString()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;
}