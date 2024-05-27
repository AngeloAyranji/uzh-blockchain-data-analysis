import { Job } from "bull";

export const TRANSFORM_PROCESSOR = 'TRANSFORM_PROCESSOR';

export interface ITransformProcessor {
  transformPairCreated(job: Job<any>): Promise<void>;
}