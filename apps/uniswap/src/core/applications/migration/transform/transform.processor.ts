import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ethers } from 'ethers';
import { ITransformProcessor } from './itransform.processor';
import { PoolCreatedTransformRequest } from './requests/poolCreated.transform.request';
import { Log } from '../../../domains/collection/log';
import { PoolAddRequest } from '../../analysis/pool/write/request/pool.add.request';


// TODO: add deployedAt in the transformation
@Processor('transform')
export class TransformProcessor implements ITransformProcessor {
  constructor(
    @InjectQueue('load')
    private readonly loadQueue: Queue
  ) {}

  @Process('POOL_CREATED_V2')
  async transformPoolCreatedV2(job: Job<PoolCreatedTransformRequest>): Promise<void> {
    const pools = job.data.logs.map((log: Log) => {
      return {
        poolAddress: ethers.utils
          .getAddress('0x' + log.data.substring(26, 66))
          .toLowerCase(),
        factoryAddress: job.data.factoryAddress,
        token0: ethers.utils
          .getAddress('0x' + log.topics[0].slice(26))
          .toLowerCase(),
        token1: ethers.utils
          .getAddress('0x' + log.topics[1].slice(26))
          .toLowerCase(),
        deployedAt: new Date(log.timestamp),
      };
    });

    await this.loadQueue.add('POOL_CREATED', pools, { removeOnComplete: true });
  }

  @Process('POOL_CREATED_V3')
  async transformPoolCreatedV3(job: Job<PoolCreatedTransformRequest>): Promise<void> {
    const pools: PoolAddRequest[] = job.data.logs.map((log: Log) => {
      return {
        poolAddress: ethers.utils
          .getAddress('0x' + log.data.substring(128, 168))
          .toLowerCase(),
        factoryAddress: job.data.factoryAddress,
        token0: ethers.utils
          .getAddress('0x' + log.topics[0].slice(26))
          .toLowerCase(),
        token1: ethers.utils
          .getAddress('0x' + log.topics[1].slice(26))
          .toLowerCase(),
        deployedAt: new Date(log.timestamp),
      };
    });

    await this.loadQueue.add('POOL_CREATED', pools, { removeOnComplete: true });
  }

  @Process('SWAP_V2')
  async transformSwapV2(job: Job<any>): Promise<void> {
  }

  @Process('SWAP_V3')
  async transformSwapV3(job: Job<any>): Promise<void> {
  }
}
