import React, { useEffect, useState } from "react";
import { PieChartLinesModel } from "../models/Uniswap";

function PieChartBarLines({ statistic }: { statistic: PieChartLinesModel[] }) {
  const [max, setMax] = useState(0);
  useEffect(() => {
    setMax(Math.max(...statistic.map((o) => o.count)));
  }, [statistic]);

  return (
    <div className="flex flex-col space-y-2 justify-between">
      {statistic.map((item, index) => (
        <div key={index} className="flex flex-col space-y-2 w-full">
          <div className="w-full flex flex-row justify-between items-center">
            <p className=" text-black font-bold">
              {item.key}
            </p>
            <p className="w-full text-end">{item.count}</p>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={item.count}
            max={max}
          ></progress>
        </div>
      ))}
    </div>
  );
}

export default PieChartBarLines;
