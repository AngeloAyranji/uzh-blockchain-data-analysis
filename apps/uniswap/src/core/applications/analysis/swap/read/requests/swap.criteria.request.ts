export class SwapCriteriaRequest {
  chainId: number;
  poolId: string;
  tokenIn: string;
  tokenOut: string;
  startDate: Date;
  endDate: Date;
  page: number;
  limit: number;
}