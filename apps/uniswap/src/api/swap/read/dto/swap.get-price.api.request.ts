import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SwapGetPriceApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsString()
    poolAddress: string;
}