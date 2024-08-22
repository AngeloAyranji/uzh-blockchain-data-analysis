import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { usePoolPriceByAddressDateRange } from "../../query/api/priceByPool";
import { DateEnum, PriceByPool } from "../../query/types";
import { dateToDayMonth, dateToMonthYear, dateToYear } from "../../utilities";
import { Input } from "./ui/input";

interface PricePoollCountCardProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
  frequency: DateEnum;
}

function PoolPriceCardByDateAddress({ title, startDate, endDate, frequency }: PricePoollCountCardProps) {
  const [address, setAddress] = useState<string>("0x9d0ddb5b36218c3446f6c6fd532fa414e399ed36");
  const { data, isLoading, refetchPoolPrice } = usePoolPriceByAddressDateRange(1, address, startDate, endDate);

  useEffect(() => {
    refetchPoolPrice();
  }, [startDate, endDate, address])

  return (
    <div className="card-container">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          <Input placeholder="Enter Pool Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <LineChart
            height={300}
            series={[
              {
                data: data.map((data: PriceByPool) => {
                  return data.average_price;
                }),
                label: "Average Price",
                id: "average_price",
              },
              {
                data: data.map((data: PriceByPool) => {
                  return data.max_price;
                }),
                label: "Max Price",
                id: "max_price",
              },
              {
                data: data.map((data: PriceByPool) => {
                  return data.min_price;
                }),
                label: "Min Price",
                id: "min_price",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PriceByPool) => {
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

export default PoolPriceCardByDateAddress;
