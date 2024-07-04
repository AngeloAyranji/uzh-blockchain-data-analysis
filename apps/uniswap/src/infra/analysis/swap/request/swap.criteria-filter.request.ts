export class SwapCriteriaFilterRequest {
  chainId: number;
  poolAddress: string;
  sender: string;
  token: string;
  startDate: Date;
  endDate: Date;
  page: number;
  limit: number;
}
