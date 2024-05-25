import { eth_transaction_logs } from '@prisma/client-collection';

export class LogEntity implements eth_transaction_logs {
    transaction_hash: string;
    address: string;
    log_index: number;
    data: string;
    removed: boolean;
    topic_0: string;
    topics: string[];
    updated_at: Date;
}