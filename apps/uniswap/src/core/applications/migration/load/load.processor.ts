import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ILoadProcessor } from './iload.processor';

@Processor('load')
export class LoadProcessor implements ILoadProcessor {
  @Process('PAIR_CREATED')
  async loadPairCreated(job: Job<any>): Promise<void> {
    console.log('Loading pair created');
  }
}
