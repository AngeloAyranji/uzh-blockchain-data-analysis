import { BarChart } from "@mui/x-charts";
import { usePoolCountByDate } from "../../query/api/uniswap/pool";
import { DateEnum, PoolCreatedByDate } from "../../query/types";
import {
  dateToDayMonth,
  dateToMonthYear,
  dateToWeek
} from "../../utilities/dateUtils";
import { useEffect } from "react";

interface PoolCreatedProps {
  title: string;
  frequency: DateEnum;
  startDate?: Date;
  endDate?: Date;
}

function PoolCreatedCountByDate({ title, frequency, startDate, endDate }: PoolCreatedProps) {
  const { data, isLoading, refetchPoolCount } = usePoolCountByDate(1, frequency, startDate, endDate);

  useEffect(() => {
    refetchPoolCount();
  }, [startDate, endDate, frequency]);
  return (
    <div className="card-container px-[10%]">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          {/* <LineChart
            height={300}
            series={[
              {
                data: data.map((data: PoolCreatedByDate) => {
                  return data.totalCountV2;
                }),
                label: "V2",
                id: "V2",
              },
              {
                data: data.map((data: PoolCreatedByDate) => {
                  return data.totalCountV3 ?? 0;
                }),
                label: "V3",
                id: "V3",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PoolCreatedByDate) => {
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
                scaleType: "point",
                label: "Time",
              },
            ]}
          /> */}
          <BarChart
            series={[
              {
                data: data.map((data: PoolCreatedByDate) => {
                  return data.totalCountV2;
                }),
                label: "V2",
                id: "V2",
              },
              {
                data: data.map((data: PoolCreatedByDate) => {
                  return data.totalCountV3 ?? 0;
                }),
                label: "V3",
                id: "V3",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PoolCreatedByDate) => {
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
        </>
      )}
    </div>
  );
}

export default PoolCreatedCountByDate;
