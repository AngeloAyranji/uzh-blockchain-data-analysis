export class Migration<T> {
    migrationId: string;
    type: MigrationType;
    phase: MigrationPhase;
    payload: T;
    error?: string;
}

export enum MigrationType {
    POOL_CREATED = 'POOL_CREATED',
    SWAP = 'SWAP',
}

export enum MigrationPhase {
    EXTRACT = 'EXTRACT',
    TRANSFORM = 'TRANSFORM',
    LOAD = 'LOAD',
}