import { Inject, Injectable } from '@nestjs/common';
import { ILiquidityMapper, LIQUIDITY_MAPPER } from './mapper/iliquidity.mapper';
import { ILiquidityModifier } from '../../../core/applications/analysis/liquidity/write/iliquidity.modifier';
import { UniswapDbHandler } from '../../db/uniswap-db.handler';
import { Liquidity } from '../../../core/domains/analysis/liquidity';
import { ILiquidityProvider } from '../../../core/applications/analysis/liquidity/read/iliquidity.provider';

@Injectable()
export class LiquidityRepository
  implements ILiquidityModifier, ILiquidityProvider
{
  constructor(
    @Inject(LIQUIDITY_MAPPER)
    private readonly liquidityMapper: ILiquidityMapper,
    private readonly uniswapDbHandler: UniswapDbHandler
  ) {}

  async createMany(liquidity: Liquidity[]): Promise<void> {
    const entities = this.liquidityMapper.mapDomainsToEntities(liquidity);
    await this.uniswapDbHandler.liquidity.createMany({
      data: entities,
    });
  }

  async getTopActiveLiquidityProvidersByPool(
    chainId: number,
    poolAddress: string,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const totalCount = await this.uniswapDbHandler.liquidity.count({
      where: {
        pool: {
          factory: {
            chainId: chainId,
          },
          poolAddress: poolAddress,
        },
        timestamp: {
          gte: startDate && startDate,
          lte: endDate && endDate,
        },
      },
    });

    const query = `
    WITH liquidity_counts AS (
        SELECT
            time_bucket('1 day', l."timestamp") AS bucket, 
            p."poolAddress" AS poolAddress,
            count("poolId") AS liquidityCount
        FROM "Liquidity" l
        JOIN "Pool" p ON l."poolId" = p."id"
        JOIN "Factory" f ON p."factoryId" = f."id"
        WHERE 
          f."chainId" = ${chainId} AND
          p."poolAddress" = '${poolAddress}'
          ${startDate ? `AND s."swapAt" >= '${startDate}'` : ''}
          ${endDate ? `AND s."swapAt" <= '${endDate}'` : ''}
        GROUP BY bucket, poolAddress
    )
    SELECT
        poolAddress,
        SUM(liquidityCount) AS liquidityCount
    FROM liquidity_counts
    GROUP BY poolAddress 
    ORDER BY liquidityCount DESC
    LIMIT ${limit ? limit : 5};
  `;

    const liquidities: any[] = await this.uniswapDbHandler.$queryRawUnsafe(
      query
    );
    return liquidities.map((liquidity) => {
      return {
        poolAddress: liquidity.pooladdress,
        count: Number(liquidity.liquidityCount),
        percentage: Number(liquidity.liquidityCount) / totalCount,
      };
    });
  }
}
