import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ITransformProcessor } from './itransform.processor';

@Processor('transform')
export class TransformProcessor implements ITransformProcessor {
  constructor(
    @InjectQueue('load')
    private readonly loadQueue: Queue
  ) {}

  @Process('PAIR_CREATED')
  async transformPairCreated(job: Job<any>): Promise<void> {}
}
