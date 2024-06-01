import { PoolCountDateEnum } from "../../../../core/applications/analysis/pool/read/response/pool.count-by-date.response";
import { VersionEnum } from "../../../../core/domains/analysis/factory";

export class PoolCountByDateApiResponse {
  chainId: number;
  version: VersionEnum;
  totalCount: number;
  date: Date;
  poolCountDateEnum: PoolCountDateEnum;
}