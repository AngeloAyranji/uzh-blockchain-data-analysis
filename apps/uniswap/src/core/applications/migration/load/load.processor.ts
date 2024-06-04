import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ILoadProcessor } from './iload.processor';
import { Inject } from '@nestjs/common';
import {
  IPoolWriteService,
  POOL_WRITE_SERVICE,
} from '../../analysis/pool/write/ipool.write.service';
import { PoolAddRequest } from '../../analysis/pool/write/request/pool.add.request';
import { SwapAddRequest } from '../../analysis/swap/write/request/swap.add.request';
import { ISwapWriteService, SWAP_WRITE_SERVICE } from '../../analysis/swap/write/iswap.write.service';

@Processor('load')
export class LoadProcessor implements ILoadProcessor {
  constructor(
    @Inject(POOL_WRITE_SERVICE)
    private readonly poolWriteService: IPoolWriteService,

    @Inject(SWAP_WRITE_SERVICE)
    private readonly swapWriteService: ISwapWriteService
  ) {}

  @Process('POOL_CREATED')
  async loadPoolCreated(job: Job<PoolAddRequest[]>): Promise<void> {
    await this.poolWriteService.addMany(job.data);
  }

  @Process('SWAP')
  async loadSwap(job: Job<SwapAddRequest[]>): Promise<void> {
    await this.swapWriteService.addMany(job.data);
    console.log("Loaded");
  }
}
