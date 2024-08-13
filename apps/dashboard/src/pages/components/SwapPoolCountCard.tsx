import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { usePoolSwapCountByDateRangeAddress } from "../../query/api/poolSwapCount";
import { PoolSwapCountByAddressDate } from "../../query/types";
import { Input } from "./ui/input";

interface SwapPoolCountCardProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

function SwapPoolCountCardByDateAddress({ title, startDate, endDate }: SwapPoolCountCardProps) {
  const [address, setAddress] = useState<string>("0xcb7badacf421f0428b1a0401f8d53e63b9b8a972");
  const { data, isLoading, refetchPoolSwapCount } = usePoolSwapCountByDateRangeAddress(1, address, startDate, endDate);

  useEffect(() => {
    refetchPoolSwapCount();
  }, [startDate, endDate, address])

  return (
    <div className="card-container">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          <Input placeholder="Enter Pool Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          {/* <LineChart
            height={300}
            series={[
              {
                data: data.map((data: PoolSwapCountByAddressDate) => {
                  return data.swapCount;
                }),
                label: "swapCount",
                id: "swapCount",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PoolSwapCountByAddressDate) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                },
                // valueFormatter: (value, context) => {
                //   if (context.location === "tooltip") {
                //     console.log("maya", value);
                //     // const date = new Date(value);
                //     // return date.toLocaleDateString();
                //   }
                //   return value;
                // },
                scaleType: "point",
                label: "Time",
              },
            ]}
          /> */}
          <BarChart
            series={[
              {
                data: data.map((data: PoolSwapCountByAddressDate) => {
                  return data.swapCount;
                }),
                label: "swapCount",
                id: "swapCount",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: PoolSwapCountByAddressDate) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                },
                // valueFormatter: (value, context) => {
                //   if (context.location === "tooltip") {
                //     console.log("maya", value);
                //     // const date = new Date(value);
                //     // return date.toLocaleDateString();
                //   }
                //   return value;
                // },
                scaleType: "band",
              },
            ]}
            height={400}
          />
        </>
      )}
    </div>
  );
}

export default SwapPoolCountCardByDateAddress;
