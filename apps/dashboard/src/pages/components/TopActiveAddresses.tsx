import { useTopActiveAddresses } from "../../query/api/uniswap/swap";
import { formatAddress } from "../../utilities";
import PieChartBarLines from "./PieChartBarLines";
import PieChartGraph from "./PieChartGraph";

interface TopActiveAddressesProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

function TopActiveAddresses({ title, endDate, startDate }: TopActiveAddressesProps) {
  const { data, isLoading } = useTopActiveAddresses(1, startDate, endDate);

  return (
    <div className="card-container">
      <div className="w-full flex justify-start card-title">{title}</div>
      {!isLoading && data && (
        <div className="grid grid-cols-12 gap-4 flex-col md:flex-row items-center">
          <div className="col-span-4">
            <PieChartGraph
              statistic={data.map((item) => ({
                key: formatAddress(item.address),
                percentage: item.percentage * 100,
              }))}
            />
          </div>
          <div className="col-start-6 col-span-7">
            <PieChartBarLines
              statistic={data.map((item) => ({
                key: formatAddress(item.address),
                count: item.count,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TopActiveAddresses;
