import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { DateEnum } from "../../query/types";
import { usePairPriceByAddressDateRange } from "../../query/api/pairPrice";
import { PairPriceByAddresses } from "../../query/types/PairPriceByAddresses";
import {
  dateToDayMonth,
  dateToMonthYear,
  dateToYear,
} from "../../utilities/dateUtils";
import { Input } from "./ui/input";

interface PairPriceCardProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
  frequency: DateEnum;
}

function PairPriceCardByDateAddress({ title, startDate, endDate, frequency }: PairPriceCardProps) {
  const [token0Address, setToken0Address] = useState<string>("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  const [token1Address, setToken1Address] = useState<string>("0xc30a5e36072612a5884aa6bdc2289fc5e8901638");
  const { data, isLoading, refetchPairPrice } = usePairPriceByAddressDateRange(1, token0Address, token1Address, startDate, endDate);

  useEffect(() => {
    refetchPairPrice();
  }, [startDate, endDate, token0Address, token1Address])

  return (
    <div className="card-container">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          <Input placeholder="Enter Token 0 Address" value={token0Address} onChange={(e) => setToken0Address(e.target.value)} />
          <Input placeholder="Enter Token 1 Address" value={token1Address} onChange={(e) => setToken1Address(e.target.value)} />
          <LineChart
            height={300}
            series={[
              {
                data: data.map((data: PairPriceByAddresses) => {
                  return data.price;
                }),
                label: "price",
                id: "price",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PairPriceByAddresses) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value, context) => {
                  if (context.location === "tick") {
                    const date = new Date(value);
                    switch (frequency) {
                      case DateEnum.DAY:
                        return dateToDayMonth(date);
                      case DateEnum.MONTH:
                        return dateToMonthYear(date);
                      case DateEnum.WEEK:
                        return dateToYear(date);
                      default:
                        break;
                    }
                  }
                  if (context.location === "tooltip") {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }
                  return value;
                },
                scaleType: "band",
              },
            ]}
          />
        </>
      )}
    </div>
  );
}

export default PairPriceCardByDateAddress;
