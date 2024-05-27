import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ILoadProcessor } from './iload.processor';
import { Inject } from '@nestjs/common';
import {
  IPoolWriteService,
  POOL_WRITE_SERVICE,
} from '../../analysis/pool/write/ipool.write.service';
import { PoolAddRequest } from '../../analysis/pool/write/request/pool.add.request';

@Processor('load')
export class LoadProcessor implements ILoadProcessor {
  constructor(
    @Inject(POOL_WRITE_SERVICE)
    private readonly poolWriteService: IPoolWriteService
  ) {}

  @Process('POOL_CREATED')
  async loadPoolCreated(job: Job<PoolAddRequest[]>): Promise<void> {
    await this.poolWriteService.addMany(job.data);
  }
}
