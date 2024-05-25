import { MigrationType } from './migration';

export class Extract<T> {
  type: MigrationType;
  payload: T;
  migrationId: string;
}