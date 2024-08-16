import { BarChart } from "@mui/x-charts";
import { useEffect } from "react";
import { useDistinctUsersByDateRange } from "../../query/api/distinctUser";
import { DistinctUsersByDate } from "../../query/types";

interface DistinctUsersCardProps {
  title: string;
  startDate?: Date;
}

function DistinctUsersCountByDateRange({ title, startDate }: DistinctUsersCardProps) {
  const { data, isLoading, refetchDistinctUsers } = useDistinctUsersByDateRange(1, startDate);

  useEffect(() => {
    refetchDistinctUsers();
  }, [startDate])

  return (
    <div className="card-container px-[10%]">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          {/* <LineChart
            height={300}
            series={[
              {
                data: data.map((data: DistinctUsersByDate) => {
                  return data.distinctUsers;
                }),
                label: "distinctUsers",
                id: "distinctUsers",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: DistinctUsersByDate) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                },
                scaleType: "point",
                label: "Time",
              },
            ]}
          /> */}
          <BarChart
            series={[
              {
                data: data.map((data: DistinctUsersByDate) => {
                  return data.distinctUsers;
                }),
                label: "distinctUsers",
                id: "distinctUsers",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: DistinctUsersByDate) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                },
                scaleType: "band"
              },
            ]}
            height={300}
          />
        </>
      )}
    </div>
  );
}

export default DistinctUsersCountByDateRange;
