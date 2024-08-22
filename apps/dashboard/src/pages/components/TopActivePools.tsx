import PieChartGraph from "./PieChartGraph";
import PieChartBarLines from "./PieChartBarLines";
import { useTopActivePools } from "../../query/api/uniswap/swap";

interface TopActivePoolsProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

function TopActivePools({ title, endDate, startDate }: TopActivePoolsProps) {
  const { data, isLoading } = useTopActivePools(1, "V2", 5, startDate, endDate);

  return (
    <div className="card-container">
      <div className="w-full flex justify-start card-title">{title}</div>
      {!isLoading && data && (
        <div className="grid grid-cols-12 gap-4 flex-col md:flex-row items-center">
          <div className="col-span-4">
            <PieChartGraph
              statistic={data.map((item) => ({
                key: item.poolTokens,
                percentage: item.percentage * 100,
              }))}
            />
          </div>
          <div className="col-start-6 col-span-7">
            <PieChartBarLines
              statistic={data.map((item) => ({
                key: item.poolTokens,
                count: item.count,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TopActivePools;
