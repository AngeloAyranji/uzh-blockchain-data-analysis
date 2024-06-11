export const EXTRACT_PROCESSOR = 'EXTRACT_PROCESSOR';

export interface IExtractProcessor {
    startMigration(): Promise<void>;
}