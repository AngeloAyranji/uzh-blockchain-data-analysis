import { BarChart } from "@mui/x-charts";
import { useEffect } from "react";
import { useDistinctUsersByDateRange } from "../../query/api/distinctUser";
import { DateEnum, DistinctUsersByDate } from "../../query/types";
import { dateToDayMonth, dateToMonthYear, dateToWeek } from "../../utilities";

interface DistinctUsersCardProps {
  title: string;
  frequency: DateEnum;
  startDate?: Date;
  endDate?: Date;
}

function DistinctUsersCountByDateRange({ title, startDate, endDate, frequency }: DistinctUsersCardProps) {
  const { data, isLoading, refetchDistinctUsers } = useDistinctUsersByDateRange(1, frequency, startDate, endDate);

  useEffect(() => {
    refetchDistinctUsers();
  }, [startDate, endDate, frequency])

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
