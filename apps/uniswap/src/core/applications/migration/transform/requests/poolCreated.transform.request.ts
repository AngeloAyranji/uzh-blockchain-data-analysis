import { Log } from "../../../../domains/collection/log";

export class PoolCreatedTransformRequest {
    logs: Log[];
    factoryAddress: string;
}