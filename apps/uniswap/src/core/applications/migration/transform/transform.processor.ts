import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ArithmeticService } from "@uzh/arithmetic";
import { ITransformProcessor } from './itransform.processor';
import { PoolCreatedTransformRequest } from './requests/poolCreated.transform.request';
import { Log } from '../../../domains/collection/log';
import { PoolAddRequest } from '../../analysis/pool/write/request/pool.add.request';
import { SwapTransformRequest } from './requests/swap.transform.request';
import { SwapAddRequest } from '../../analysis/swap/write/request/swap.add.request';

@Processor('transform')
export class TransformProcessor implements ITransformProcessor {
  constructor(
    @InjectQueue('load')
    private readonly loadQueue: Queue,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly arithmeticService: ArithmeticService,
  ) { }

  @Process('POOL_CREATED_V2')
  async transformPoolCreatedV2(
    job: Job<PoolCreatedTransformRequest>
  ): Promise<void> {
    const pools = job.data.logs.map((log: Log) => {
      return {
        poolAddress: ethers.utils
          .getAddress('0x' + log.data.substring(26, 66))
          .toLowerCase(),
        factoryId: job.data.factoryId,
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
  async transformPoolCreatedV3(
    job: Job<PoolCreatedTransformRequest>
  ): Promise<void> {
    const pools: PoolAddRequest[] = job.data.logs.map((log: Log) => {
      return {
        poolAddress: ethers.utils
          .getAddress('0x' + log.data.substring(128, 168))
          .toLowerCase(),
        factoryId: job.data.factoryId,
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
  async transformSwapV2(job: Job<SwapTransformRequest>): Promise<void> {
    const swaps: SwapAddRequest[] = [];

    for (const log of job.data.logs) {
      const poolId = await this.cacheManager.get(log.address.toLowerCase());

      if (poolId != null) {
        const decodedValues = ethers.utils.defaultAbiCoder.decode(
          ['uint', 'uint', 'uint', 'uint'],
          log.data
        );

        const amount0In = decodedValues[0].toString();
        const amount1In = decodedValues[1].toString();
        const amount0Out = decodedValues[2].toString();
        const amount1Out = decodedValues[3].toString();
        const reversed = amount0In === '0' && amount1Out === '0';

        const priceWithoutDecimal = this.arithmeticService.gt(amount0In, '0') &&
          this.arithmeticService.gt(amount1Out, '0') ? this.arithmeticService.div(amount0In, amount1Out) : this.arithmeticService.div(amount1In, amount0Out);

        swaps.push({
          poolId: poolId,
          transactionHash: log.transactionHash,
          sender: ethers.utils
            .getAddress('0x' + log.topics[0].slice(26))
            .toLowerCase(),
          recipient: ethers.utils
            .getAddress('0x' + log.topics[1].slice(26))
            .toLowerCase(),
          amountIn: reversed ? amount1In : amount0In,
          amountOut: reversed ? amount0Out : amount1Out,
          reversed: reversed,
          price: priceWithoutDecimal,
          swapAt: new Date(log.timestamp),
        });
      }
    }

    console.log('transformation', swaps.length);
    await this.loadQueue.add('SWAP', swaps, { removeOnComplete: true });
  }

  @Process('SWAP_V3')
  async transformSwapV3(job: Job<SwapTransformRequest>): Promise<void> {
    const swaps: SwapAddRequest[] = [];
    for (const log of job.data.logs) {
      const poolId = await this.cacheManager.get(log.address);

      if (poolId != null) {
        const decodedValues = ethers.utils.defaultAbiCoder.decode(
          ['int256', 'int256', 'uint160', 'uint128', 'int24'],
          log.data
        );

        swaps.push({
          poolId: poolId,
          transactionHash: log.transactionHash,
          sender: ethers.utils
            .getAddress('0x' + log.topics[0].slice(26))
            .toLowerCase(),
          recipient: ethers.utils
            .getAddress('0x' + log.topics[1].slice(26))
            .toLowerCase(),
          amountIn: new BigNumber(decodedValues[0].toString()).abs().toString(),
          amountOut: new BigNumber(decodedValues[1].toString()).toString(),
          reversed: new BigNumber(decodedValues[0].toString()).isNegative(),
          price: this.priceFromPriceSqrtX96(decodedValues[2].toString()),
          swapAt: new Date(log.timestamp),
        });
      }
    }

    await this.loadQueue.add('SWAP', swaps, { removeOnComplete: true });
  }

  priceFromPriceSqrtX96(sqrtPriceX96: string): string {
    const x96 = new BigNumber('2').pow(96);
    const sqrtPrice = new BigNumber(sqrtPriceX96).div(x96);
    const price = sqrtPrice.pow(2);
    return price.toString();
  }
}
