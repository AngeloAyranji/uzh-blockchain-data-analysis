import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { PieChartGraphModel } from "../models/Uniswap";

function PieChartGraph({ statistic }: { statistic: PieChartGraphModel[] }) {
  const options = {
    legend: {
      display: false,
    },
  };

  const [chartData, setChartData] = useState<
    { id: number; value: number; label: string }[]
  >([]);

  useEffect(() => {
    setChartData(
      statistic.map((value, index) => ({
        id: index,
        value: value.percentage,
        label: value.key,
      }))
    );
  }, [statistic]);

  return (
    <div>
      <PieChart
        slotProps={{ legend: { hidden: true } }}
        series={[
          {
            data: chartData,
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 1,
            cornerRadius: 2,
            startAngle: 0,
            endAngle: 360,
          },
        ]}
        width={300}
        height={200}
      />
    </div>
  );
}

export default PieChartGraph;
