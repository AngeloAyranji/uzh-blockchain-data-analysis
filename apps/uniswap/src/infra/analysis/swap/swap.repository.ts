import { Inject, Injectable } from '@nestjs/common';
import { ISwapModifier } from '../../../core/applications/analysis/swap/write/iswap.modifier';
import { ISwapMapper, SWAP_MAPPER } from './mapper/iswap.mapper';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Swap } from '../../../core/domains/analysis/swap';
import { ISwapProvider } from '../../../core/applications/analysis/swap/read/iswap.provider.service';
import { PaginationContext } from '../../../core/domains/valueobject/paginationContext';
import { VersionEnum } from '../../../core/domains/analysis/factory';

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
    chainId: number,
    page: number,
    limit: number
  ): Promise<PaginationContext<Swap>> {
    const offset = (page - 1) * limit;

    const totalCount = await this.uniswapDbHandler.swap.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
        },
      },
    });

    const entities = await this.uniswapDbHandler.swap.findMany({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        swapAt: 'desc',
      },
    });

    const swapDomains = this.swapMapper.mapEntitiesToDomains(entities);

    const currentPage = Math.ceil((offset + 1) / limit);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      payload: swapDomains,
      pagination: {
        totalCount,
        page: currentPage,
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

    const pools = await this.uniswapDbHandler.swap.groupBy({
      by: ['poolId'],
      _count: {
        poolId: true,
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

    const sortedTokens = pools
      .sort((a, b) => b._count.poolId - a._count.poolId)
      .slice(0, 5);

    // TODO: here should be poolAddress no ID
    return sortedTokens.map((pool) => {
      return {
        poolAddress: pool.poolId,
        count: pool._count.poolId,
        percentage: pool._count.poolId / totalCount,
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
}
