import { IsNotEmpty, IsNumber } from "class-validator";

export class SwapGetAllWithPaginationApiRequest {
    @IsNotEmpty()
    @IsNumber()
    chainId: number;

    @IsNotEmpty()
    @IsNumber()
    page: number;

    @IsNotEmpty()
    @IsNumber()
    limit: number;
}