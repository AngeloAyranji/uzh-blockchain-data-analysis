import {
  AllSeriesType,
  BarPlot,
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { useEffect, useState } from "react";
import { PoolPriceAndVolume } from "../../query/types";
import { BaseResponse } from "../../query/types/base-response";
import { Frequency } from "../../utilities/Consts";
import {
  dateToDayMonth,
  dateToMonthYear,
  dateToYear,
} from "../../utilities/dateUtils";

interface LineChartProps {
  title: string;
  frequency: number;
}
function LineChartCard({ title, frequency }: LineChartProps) {
  const lineData: BaseResponse<PoolPriceAndVolume[]> = {
    statusCode: 200,
    result: {
      data: [
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-12T00:00:00.000Z"),
        },
        {
          price: 12,
          volume: 1,
          time: new Date("2024-06-13T00:00:00.000Z"),
        },
        {
          price: 37,
          volume: 23,
          time: new Date("2024-06-14T00:00:00.000Z"),
        },
        {
          price: 24,
          volume: 76,
          time: new Date("2024-06-15T00:00:00.000Z"),
        },
        {
          price: 11,
          volume: 87,
          time: new Date("2024-06-16T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-17T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-18T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-19T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-20T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-21T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-22T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-23T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-24T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-25T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-26T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-27T00:00:00.000Z"),
        },
        {
          price: 34,
          volume: 115,
          time: new Date("2024-06-28T00:00:00.000Z"),
        },
      ],
      error: null,
    },
  };
  const series: AllSeriesType[] = [
    {
      type: "line",
      dataKey: "price",
    },
    {
      type: "bar",
      dataKey: "volume",
      yAxisKey: "rightAxis",
      xAxisKey: "xAxis",
    },
  ];

  const [max, setMax] = useState(4000);
  useEffect(() => {
    setMax(Math.max(...lineData.result.data.map((o) => o.volume)));
  }, [lineData]);

  return (
    <div className="card-container">
      <div className="w-full flex justify-start card-title">{title}</div>
      <ResponsiveChartContainer
        series={series}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "time",
            label: "Time",
            reverse: false,
            id: "xAxis",
            valueFormatter: (value, context) => {
              if (context.location === "tick") {
                const date = new Date(value);
                switch (frequency) {
                  case Frequency.Daily:
                    return dateToDayMonth(date);
                  case Frequency.Monthly:
                    return dateToMonthYear(date);
                  case Frequency.Yealy:
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
          },
        ]}
        yAxis={[
          { id: "leftAxis", reverse: false },
          {
            id: "rightAxis",
            reverse: false,
            min: 0,
            max: max * 12,
          },
        ]}
        dataset={lineData.result.data.map((item: PoolPriceAndVolume) => {
          return {
            price: item.price,
            volume: item.volume,
            time: item.time,
          };
        })}
        height={500}
      >
        <ChartsGrid horizontal vertical />
        <BarPlot />
        <LinePlot />
        <MarkPlot />
        <ChartsXAxis axisId="xAxis" />
        <ChartsYAxis axisId="leftAxis" position="left" label="Price" />
        <ChartsTooltip />
      </ResponsiveChartContainer>
    </div>
  );
}

export default LineChartCard;
