export class SwapCriteriaRequest {
  chainId: number;
  poolAddress: string;
  token: string;
  startDate: Date;
  endDate: Date;
  page: number;
  limit: number;
}