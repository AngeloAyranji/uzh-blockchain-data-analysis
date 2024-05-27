import { Job } from "bull";
import { PoolAddRequest } from "../../analysis/pool/write/request/pool.add.request";

export const LOAD_PROCESSOR = 'LOAD_PROCESSOR';

export interface ILoadProcessor {
    loadPoolCreated(job: Job<PoolAddRequest[]>): Promise<void>;
}