import { Inject, Injectable } from '@nestjs/common';
import { ISwapModifier } from '../../../core/applications/analysis/swap/write/iswap.modifier';
import { ISwapMapper, SWAP_MAPPER } from './mapper/iswap.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Swap } from '../../../core/domains/analysis/swap';
import { ISwapProvider } from '../../../core/applications/analysis/swap/read/iswap.provider.service';
import { PaginationContext } from '../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../core/domains/analysis/factory';
import { SwapCriteriaFilterRequest } from './request/swap.criteria-filter.request';
import { SwapCriteriaResponse } from '../../../core/applications/analysis/swap/read/requests/swap.criteria.response';

@Injectable()
export class SwapRepository implements ISwapModifier, ISwapProvider {
  constructor(
    @Inject(SWAP_MAPPER)
    private readonly swapMapper: ISwapMapper,
    private readonly uniswapDbHandler: UniswapDbHandler
  ) {}

  async createMany(swaps: Swap[]): Promise<void> {
    const entities = this.swapMapper.mapDomainsToEntities(swaps);
    await this.uniswapDbHandler.swap.createMany({
      data: entities,
    });
  }

  async findSwapsWithPagination(
    swapCriteriaFilterRequest: SwapCriteriaFilterRequest
  ): Promise<PaginationContext<SwapCriteriaResponse>> {
    const chainId = Number(swapCriteriaFilterRequest.chainId);
    const page = Number(swapCriteriaFilterRequest.page);
    const limit = Number(swapCriteriaFilterRequest.limit);

    const offset = (page - 1) * limit;

    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
          OR: [
            {
              token0: swapCriteriaFilterRequest.token && swapCriteriaFilterRequest.token,
            },
            {
              token1: swapCriteriaFilterRequest.token && swapCriteriaFilterRequest.token,
            },
          ],
        },
        poolId:
          swapCriteriaFilterRequest.poolId && swapCriteriaFilterRequest.poolId,
        // sender:
        //   swapCriteriaFilterRequest.tokenIn &&
        //   swapCriteriaFilterRequest.tokenIn,
        // recipient:
        //   swapCriteriaFilterRequest.tokenOut &&
        //   swapCriteriaFilterRequest.tokenOut,
        swapAt: {
          gte:
            swapCriteriaFilterRequest.startDate &&
            swapCriteriaFilterRequest.startDate,
          lte:
            swapCriteriaFilterRequest.endDate &&
            swapCriteriaFilterRequest.endDate,
        },
      },
    });

    const entities = await this.uniswapDbHandler.swap.findMany({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
          OR: [
            {
              token0: swapCriteriaFilterRequest.token,
            },
            {
              token1: swapCriteriaFilterRequest.token,
            },
          ],
        },
        poolId:
          swapCriteriaFilterRequest.poolId && swapCriteriaFilterRequest.poolId,
        // sender:
        //   swapCriteriaFilterRequest.tokenIn &&
        //   swapCriteriaFilterRequest.tokenIn,
        // recipient:
        //   swapCriteriaFilterRequest.tokenOut &&
        //   swapCriteriaFilterRequest.tokenOut,
        swapAt: {
          gte:
            swapCriteriaFilterRequest.startDate &&
            swapCriteriaFilterRequest.startDate,
          lte:
            swapCriteriaFilterRequest.endDate &&
            swapCriteriaFilterRequest.endDate,
        },
      },
      select: {
        id: true,
        pool: {
          select: {
            token0: true,
            token1: true,
          },
        },
        transactionHash: true,
        sender: true,
        recipient: true,
        amountIn: true,
        amountOut: true,
        reversed: true,
        price: true,
        swapAt: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        swapAt: 'desc',
      },
    });

    const swaps = this.swapMapper.mapSwapWithPoolEntitytoSwapWithPool(entities);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    console.log(swaps);
    return {
      payload: swaps,
      pagination: {
        totalCount,
        page: page,
        limit: limit,
        totalPages,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  async getTopActivePools(
    chainId: number,
    version?: VersionEnum
  ): Promise<any> {
    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
            version: version && version,
          },
        },
      },
    });

    const query = `
    SELECT 
        p."id" AS poolId, 
        p."poolAddress" AS poolAddress, 
        COUNT(s."id") AS swapCount
    FROM 
        "Swap" s
    JOIN 
        "Pool" p ON s."poolId" = p."id"
    JOIN 
        "Factory" f ON p."factoryId" = f."id"
    WHERE 
        f."chainId" = ${chainId}
        ${version ? `AND f."version" = '${version}'` : ''}
    GROUP BY 
        p."id"
    ORDER BY 
        swapCount DESC
    LIMIT 5
`;
    const pools: any[] = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return pools.map((pool) => {
      return {
        poolAddress: pool.pooladdress,
        count: Number(pool.swapcount),
        percentage: Number(pool.swapcount) / totalCount,
      };
    });
  }

  async getTopActiveAddresses(
    chainId: number,
    version?: VersionEnum
  ): Promise<any> {
    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
            version: version && version,
          },
        },
      },
    });

    const addresses = await this.uniswapDbHandler.swap.groupBy({
      by: ['sender'],
      _count: {
        sender: true,
      },
      where: {
        pool: {
          factory: {
            chainId: chainId,
            version: version && version,
          },
        },
      },
    });

    const sortedAddresses = addresses
      .sort((a, b) => b._count.sender - a._count.sender)
      .slice(0, 5);

    return sortedAddresses.map((address) => {
      return {
        address: address.sender,
        count: address._count.sender,
        percentage: address._count.sender / totalCount,
      };
    });
  }

  async getDailyPriceOfPool(
    chainId: number,
    poolAddress: string
  ): Promise<any> {
    const result = await this.uniswapDbHandler.$queryRaw`
    SELECT
      DATE("Swap"."swapAt") as date,
      AVG(CAST("Swap"."price" as FLOAT)) as averagePrice
    FROM
      "Swap"
    JOIN
      "Pool" ON "Swap"."poolId" = "Pool"."id"
    JOIN
      "Factory" ON "Pool"."factoryId" = "Factory"."id"
    WHERE
      "Pool"."poolAddress" = ${poolAddress} AND
      "Factory"."chainId" = ${chainId}
    GROUP BY
      DATE("Swap"."swapAt")
    ORDER BY
      DATE("Swap"."swapAt");
  `;

    return result;
  }
}
