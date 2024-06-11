import { InjectQueue, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import { ITransformProcessor } from './itransform.processor';

@Processor('transform')
export class TransformProcessor implements ITransformProcessor {
  constructor(
    @InjectQueue('load')
    private readonly loadQueue: Queue,
  ) {}
}
