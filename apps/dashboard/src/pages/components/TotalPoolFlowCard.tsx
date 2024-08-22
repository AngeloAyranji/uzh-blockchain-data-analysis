import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { usePoolTotalFlowByDateRange } from "../../query/api/liquidity/poolTotalFlow";
import { PoolFlowsByDate } from "../../query/types/poolFlows";
import { Input } from "./ui/input";
import { DateEnum } from "../../query/types";
import { dateToDayMonth, dateToMonthYear, dateToWeek } from "../../utilities";

interface TotalPoolFlowProps {
  title: string;
  frequency: DateEnum;
  startDate?: Date;
  endDate?: Date;
}

function TotalPoolFlowByTypeAndDate({ title, endDate, startDate, frequency
}: TotalPoolFlowProps) {
  const [address, setAddress] = useState<string>("0xac29cd4e6e52cce3f13b94241c00292564d9e6fe");
  const { data, isLoading, refetchPoolTotalFlow } = usePoolTotalFlowByDateRange(1, address, frequency, startDate, endDate);

  useEffect(() => {
    refetchPoolTotalFlow();
  }, [startDate, endDate, address, frequency]);
  return (
    <div className="card-container px-[10%]">
      <div className="w-full flex justify-start card-title">{title}</div>
      <Input placeholder="Enter Pool Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      {!isLoading && data && (
        <BarChart
            series={[
              {
                data: data.map((data: PoolFlowsByDate) => {
                  return parseFloat(data.amount0);
                }),
                label: "Amount0",
                id: "Amount0",
              },
              {
                data: data.map((data: PoolFlowsByDate) => {
                  return parseFloat(data.amount1);
                }),
                label: "Amount1",
                id: "Amount1",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PoolFlowsByDate) => {
                  const newDate = new Date(data.date);
                  return newDate;
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
                        return dateToWeek(date);
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
            height={300}
          />
      )}
    </div>
  );
}

export default TotalPoolFlowByTypeAndDate;
