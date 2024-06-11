export class LogEntity {
    transaction_hash: string;
    block_number: bigint;
    block_timestamp: Date;
    address: string;
    log_index: number;
    data: string;
    removed: boolean;
    topic_0: string;
    topics: string[];
    updated_at: Date;
}