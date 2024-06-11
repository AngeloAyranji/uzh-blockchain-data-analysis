import { Processor } from '@nestjs/bull';
import { ILoadProcessor } from './iload.processor';

@Processor('load')
export class LoadProcessor implements ILoadProcessor {
  constructor() {}
}
