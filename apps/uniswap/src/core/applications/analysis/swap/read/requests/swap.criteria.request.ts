export class SwapCriteriaRequest {
  chainId: number;
  poolId: string;
  token: string;
  startDate: Date;
  endDate: Date;
  page: number;
  limit: number;
}