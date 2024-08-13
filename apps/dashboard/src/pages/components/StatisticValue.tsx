import { StatisticValueModel } from "../models/Uniswap";

function StatisticValue({ statistic }: { statistic: StatisticValueModel }) {
  return (
    <div className="flex flex-col items-center space-y-2"> {/* Adjusted classes here */}
      <p className="text-3xl font-semibold text-black">{statistic.value}</p>
      <p className="text-lg text-gray-500 font-semibold">{statistic.info}</p>
    </div>
  );
}

export default StatisticValue;