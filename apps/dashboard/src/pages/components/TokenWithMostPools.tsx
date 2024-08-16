import PieChartGraph from "./PieChartGraph";
import PieChartBarLines from "./PieChartBarLines";
import { Version } from "../../query/types";
import { useTokensWithMostPools } from "../../query/api/uniswap/pool";

interface TokenWithMostPoolsProps {
  title: string;
  version: Version;
}

function TokenWithMostPools({ title, version }: TokenWithMostPoolsProps) {
  const { data, isLoading } = useTokensWithMostPools(1, version);

  return (
    <div className="card-container">
      <div className="w-full flex justify-start card-title">{title}</div>
      {!isLoading && data && (
        <div className="grid grid-cols-12 gap-4 flex-col md:flex-row items-center">
          <div className="col-span-4">
            <PieChartGraph
              statistic={data.map((item) => ({
                key: item.symbol,
                percentage: item.percentage * 100,
              }))}
            />
          </div>
          <div className="col-start-6 col-span-7">
            <PieChartBarLines
              statistic={data.map((item) => ({
                key: item.symbol,
                count: item.count,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenWithMostPools;
