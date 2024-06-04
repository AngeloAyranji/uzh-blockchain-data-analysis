import { Inject, Injectable } from "@nestjs/common";
import { ISwapModifier } from "../../../core/applications/analysis/swap/write/iswap.modifier";
import { ISwapMapper, SWAP_MAPPER } from "./mapper/iswap.mapper";
import { UniswapDbHandler } from "../../db/uniswap-db.handler";
import { Swap } from "../../../core/domains/analysis/swap";
import { ISwapProvider } from "../../../core/applications/analysis/swap/read/iswap.provider.service";
import { PaginationContext } from "../../../core/domains/valueobject/paginationContext";

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

    async findSwapsWithPagination(chainId: number, page: number, limit: number): Promise<PaginationContext<Swap>> {
        const offset = (page - 1) * limit;

        const totalCount = await this.uniswapDbHandler.swap.count({
            where: {
                pool: {
                    factory: {
                        chainId: chainId,
                    }
                }
            }
        });

        const entities = await this.uniswapDbHandler.swap.findMany({
            where: {
                pool: {
                    factory: {
                        chainId: chainId,
                    }
                }
            },
            take: limit,
            skip: offset,
            orderBy: {
                swapAt: 'desc',
            }
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
}