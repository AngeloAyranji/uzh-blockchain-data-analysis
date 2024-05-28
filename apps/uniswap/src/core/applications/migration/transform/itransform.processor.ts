import { Job } from "bull";
import { PoolCreatedTransformRequest } from "./requests/poolCreated.transform.request";

export const TRANSFORM_PROCESSOR = 'TRANSFORM_PROCESSOR';

export interface ITransformProcessor {
  transformPoolCreatedV2(job: Job<PoolCreatedTransformRequest>): Promise<void>;
  transformPoolCreatedV3(job: Job<PoolCreatedTransformRequest>): Promise<void>;
  transformSwapV2(job: Job<any>): Promise<void>;
  transformSwapV3(job: Job<any>): Promise<void>;
}