export class Transaction {
    transaction_hash: string;
    block_number: string;
    from_address: string;
    to_address: string;
    value: string;
    transaction_fee: string;
    gas_price: string;
    gas_limit: string;
    gas_used: string;
    is_token_tx: boolean;
    input_data: string;
}