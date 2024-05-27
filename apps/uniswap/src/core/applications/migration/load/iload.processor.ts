import { Job } from "bull";

export const LOAD_PROCESSOR = 'LOAD_PROCESSOR';

export interface ILoadProcessor {
    loadPairCreated(job: Job<any>): Promise<void>;
}