import { Job } from "bull";
import { PoolCreatedTransformRequest } from "./requests/poolCreated.transform.request";
import { Log } from "../../../domains/collection/log";
import { SwapAddRequest } from "../../analysis/swap/write/request/swap.add.request";

export const TRANSFORM_PROCESSOR = 'TRANSFORM_PROCESSOR';

export interface ITransformProcessor {
  transformPoolCreatedV2(job: Job<PoolCreatedTransformRequest>): Promise<void>;
  transformPoolCreatedV3(job: Job<PoolCreatedTransformRequest>): Promise<void>;
  transformSwapV2(log: Log, poolId: string): Promise<SwapAddRequest>;
  transformSwapV3(log: Log, poolId: string): Promise<SwapAddRequest>;
}