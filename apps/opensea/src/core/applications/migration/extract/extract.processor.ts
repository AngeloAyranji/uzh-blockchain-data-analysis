import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import JSONdb from 'simple-json-db';
import { IExtractProcessor } from './iextract.processor';
import { ILogReadService, LOG_READ_SERVICE } from '../../collection/log/read/ilog.read.service';

@Injectable()
export class ExtractProcessor implements IExtractProcessor {
  private nextPhaseIntervalId: NodeJS.Timeout;

  constructor(
    @InjectQueue('transform')
    private readonly transformQueue: Queue,

    @InjectQueue('load')
    private readonly loadQueue: Queue,

    @Inject(LOG_READ_SERVICE)
    private readonly logReadService: ILogReadService,

    private readonly config: ConfigService
  ) {
    this.startMigration();
  }

  async startMigration() {
    Logger.log('Migration started');

  }

  private getCursor(key: string): any {
    const cursorDb = new JSONdb('./apps/opensea/json-db.json');
    return cursorDb.get(key);
  }

  private setCursor(key: string, value: any): void {
    const cursorDb = new JSONdb('./apps/opensea/json-db.json');
    cursorDb.set(key, value);
  }

  private retreiveChainId(): number {
    const network = this.config.get<string>('NETWORK');

    switch (network) {
      case 'eth':
        return 1;
      case 'bsc':
        return 61;
      default:
        return 1;
    }
  }
}
