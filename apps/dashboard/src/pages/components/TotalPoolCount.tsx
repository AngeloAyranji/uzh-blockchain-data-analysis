import { usePoolTotalCount } from "../../query/api/uniswap/pool";
import { PoolTotalCount } from "../../query/types";
import StatisticValue from "./StatisticValue";

function TotalPoolCount() {
  const { poolTotalCount, isLoading } = usePoolTotalCount(1);

  return (
    <div className="w-full p-8 sm:p-4 flex flex-col justify-center items-center bg-white rounded-2xl shadow-md sm:w-[70%]">
      <div className="w-full flex justify-center card-title">
        Total Pool Count
      </div>
      {!isLoading && poolTotalCount && (
        <div className="w-full flex justify-around sm:flex-row flex-col gap-8">
          <StatisticValue
            statistic={{
              info: "Total",
              value: poolTotalCount.reduce(
                (sum: number, pool: PoolTotalCount) => sum + pool.totalCount,
                0
              ),
            }}
          />
          {poolTotalCount.map((statistic: PoolTotalCount) => (
            <StatisticValue
              statistic={{
                info: statistic.factoryVersion,
                value: statistic.totalCount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TotalPoolCount;
