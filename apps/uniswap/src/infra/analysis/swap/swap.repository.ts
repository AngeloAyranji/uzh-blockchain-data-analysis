import { Inject, Injectable } from '@nestjs/common';
import { ISwapModifier } from '../../../core/applications/analysis/swap/write/iswap.modifier';
import { ISwapMapper, SWAP_MAPPER } from './mapper/iswap.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Swap, TimeframeEnum } from '../../../core/domains/analysis/swap';
import { ISwapProvider } from '../../../core/applications/analysis/swap/read/iswap.provider';
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
  ) { }

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
          poolAddress: swapCriteriaFilterRequest.poolAddress && swapCriteriaFilterRequest.poolAddress,
          OR: swapCriteriaFilterRequest.token && [
            {
              token0: swapCriteriaFilterRequest.token,
            },
            {
              token1: swapCriteriaFilterRequest.token,
            },
          ],
        },
        swapAt: {
          gte:
            swapCriteriaFilterRequest.startDate &&
            swapCriteriaFilterRequest.startDate,
          lte:
            swapCriteriaFilterRequest.endDate &&
            swapCriteriaFilterRequest.endDate,
        },
        sender: swapCriteriaFilterRequest.sender && swapCriteriaFilterRequest.sender,
      },
    });

    const entities = await this.uniswapDbHandler.swap.findMany({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
          OR: swapCriteriaFilterRequest.token && [
            {
              token0: swapCriteriaFilterRequest.token,
            },
            {
              token1: swapCriteriaFilterRequest.token,
            },
          ],
          poolAddress:
            swapCriteriaFilterRequest.poolAddress && swapCriteriaFilterRequest.poolAddress,
        },
        swapAt: {
          gte:
            swapCriteriaFilterRequest.startDate &&
            swapCriteriaFilterRequest.startDate,
          lte:
            swapCriteriaFilterRequest.endDate &&
            swapCriteriaFilterRequest.endDate,
        },
        sender: swapCriteriaFilterRequest.sender && swapCriteriaFilterRequest.sender,
      },
      select: {
        id: true,
        pool: {
          select: {
            token0: true,
            token1: true,
            factory: {
              select: {
                version: true,
              },
            },
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

  async getSwapsByPoolAddress(chainId: number, poolAddress: string, startDate?: Date, endDate?: Date): Promise<any> {
    const query = `
      SELECT
        time_bucket('1 day', s."swapAt") AS date,
        count("poolId") AS count
      FROM "Swap" s
      JOIN "Pool" p ON s."poolId" = p."id"
      JOIN "Factory" f ON p."factoryId" = f."id"
      WHERE
        f."chainId" = ${chainId} AND
        p."poolAddress" = '${poolAddress}'
        ${startDate ? `AND s."swapAt" >= '${startDate}'` : ''}
        ${endDate ? `AND s."swapAt" <= '${endDate}'` : ''}
      GROUP BY date
    `;

    const swapCount: any[] = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return swapCount.map((swap) => {
      return {
        date: swap.date,
        count: Number(swap.count),
      }
    });
  }

  async getTopActivePools(
    chainId: number,
    version?: VersionEnum,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
            version: version && version,
          },
        },
        swapAt: {
          gte: startDate && startDate,
          lte: endDate && endDate,
        }
      },
    });

    const query = `
      WITH swap_counts AS (
          SELECT
              time_bucket('1 day', s."swapAt") AS bucket, 
              p."poolAddress" AS poolAddress,
              count("poolId") AS swapCount
          FROM "Swap" s
          JOIN "Pool" p ON s."poolId" = p."id"
          JOIN "Factory" f ON p."factoryId" = f."id"
          WHERE 
            f."chainId" = ${chainId}
            ${version ? `AND f."version" = '${version}'` : ''}
            ${startDate ? `AND s."swapAt" >= '${startDate}'` : ''}
            ${endDate ? `AND s."swapAt" <= '${endDate}'` : ''}
          GROUP BY bucket, poolAddress
      )
      SELECT
          poolAddress,
          SUM(swapCount) AS swapCount
      FROM swap_counts
      GROUP BY poolAddress 
      ORDER BY swapCount DESC
      LIMIT ${limit ? limit : 5};
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
    version?: VersionEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
            version: version && version,
          },
        },
        swapAt: {
          gte: startDate && startDate,
          lte: endDate && endDate,
        }
      }
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
        swapAt: {
          gte: startDate && startDate,
          lte: endDate && endDate,
        }
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
    poolAddress: string,
    timeframe?: TimeframeEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {

    const query = `
      SELECT
        time_bucket('1 ${timeframe ? timeframe : 'day'}', s."swapAt") AS date,
        max(s."price"::numeric) AS max_price,
        avg(s."price"::numeric) AS average_price,
        min(s."price"::numeric) AS min_price
      FROM "Swap" s
      JOIN "Pool" p ON s."poolId" = p."id"
      JOIN "Factory" f ON p."factoryId" = f."id"
      WHERE
        f."chainId" = ${chainId} AND
        p."poolAddress" = '${poolAddress}'
        ${startDate ? `AND s."swapAt" >= '${startDate}'` : ''}
        ${endDate ? `AND s."swapAt" <= '${endDate}'` : ''}
      GROUP BY date
      ORDER BY date ASC
    `;
    const result = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return result;
  }

  async getPriceOfPair(
    chainId: number,
    token0: string,
    token1: string,
    timeframe?: TimeframeEnum,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {

    const query = `
      SELECT
        time_bucket('1 ${timeframe ? timeframe : 'day'}', s."swapAt") AS date,
        max(s."price"::numeric) AS max_price,
        avg(s."price"::numeric) AS average_price,
        min(s."price"::numeric) AS min_price
      FROM "Swap" s
      JOIN "Pool" p ON s."poolId" = p."id"
      JOIN "Factory" f ON p."factoryId" = f."id"
      WHERE
        f."chainId" = ${chainId} AND
        p."token0" = '${token0}' AND
        p."token1" = '${token1}'
        ${startDate ? `AND s."swapAt" >= '${startDate}'` : ''}
        ${endDate ? `AND s."swapAt" <= '${endDate}'` : ''}
      GROUP BY date
      ORDER BY date ASC
    `;

    const result = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return result;
  }

  async getNewUsersByDate(chainId: number, startDate?: Date, endDate?: Date): Promise<any> {
    const query = `
      WITH FirstSwaps AS (
          SELECT 
              sender,
              MIN("swapAt") AS first_swap_at
          FROM 
              "Swap"
          GROUP BY 
              sender
      ),
      NewSendersByDate AS (
          SELECT
              first_swap_at::date AS date,
              COUNT(sender) AS count
          FROM 
              FirstSwaps
          GROUP BY 
              first_swap_at::date
      )
      SELECT 
          date,
          count
      FROM 
          NewSendersByDate
      ORDER BY 
          date;
    `;

    const result: any[] = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return result.map((newUser) => {
      return {
        date: newUser.date,
        count: Number(newUser.count),
      }
    });
  }

  async getDistinctUsersByDate(chainId: number, startDate?: Date, endDate?: Date): Promise<any> {
    const query = `
      SELECT
          time_bucket('1 day', "swapAt") AS date,
          COUNT(DISTINCT sender) AS count
      FROM
          "Swap"
      GROUP BY
          time_bucket('1 day', "swapAt")
      ORDER BY
          date;
    `;

    const result: any[] = await this.uniswapDbHandler.$queryRawUnsafe(query);

    return result.map((distinctUser) => {
      return {
        date: distinctUser.date,
        count: Number(distinctUser.count),
      }
    });
  }
}
