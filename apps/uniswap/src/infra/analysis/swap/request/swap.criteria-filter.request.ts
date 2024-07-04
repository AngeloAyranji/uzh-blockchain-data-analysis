export class SwapCriteriaFilterRequest {
  chainId: number;
  poolId: string;
  sender: string;
  token: string;
  startDate: Date;
  endDate: Date;
  page: number;
  limit: number;
}
