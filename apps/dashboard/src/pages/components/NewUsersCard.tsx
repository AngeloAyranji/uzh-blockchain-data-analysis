import { BarChart } from "@mui/x-charts";
import { useEffect } from "react";
import { useNewUsersByDateRange } from "../../query/api/newUser";
import { NewUsersByDate } from "../../query/types";

interface NewUsersCardProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

function NewUsersCountByDateRange({ title, startDate, endDate }: NewUsersCardProps) {
  const { data, isLoading, refetchNewUsers } = useNewUsersByDateRange(1, startDate, endDate);

  useEffect(() => {
    refetchNewUsers();
  }, [startDate, endDate])

  return (
    <div className="card-container px-[10%]">
      {!isLoading && data && (
        <>
          <div className="w-full flex justify-start card-title">{title}</div>
          {/* <LineChart
            height={300}
            series={[
              {
                data: data.map((data: NewUsersByDate) => {
                  return data.newUsers;
                }),
                label: "newUsers",
                id: "newUsers",
              },
            ]}
            xAxis={[
              {
                data: data.map((data: NewUsersByDate) => {
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
            xAxis={[
              {
                data: data.map((data: NewUsersByDate) => {
                  return new Date(data.date);
                }),
                valueFormatter: (value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                },
                scaleType: 'band'
                // valueFormatter: (value, context) => {
                //   if (context.location === "tooltip") {
                //     console.log("maya", value);
                //     // const date = new Date(value);
                //     // return date.toLocaleDateString();
                //   }
                //   return value;
                // },
                // scaleType: "point",
                // label: "Time",
              },
            ]}
            series={[
              {
                data: data.map((data: NewUsersByDate) => {
                  return data.newUsers;
                }),
                label: "newUsers",
                id: "newUsers",
              },
            ]}
            height={300}
          />
        </>
      )}
    </div>
  );
}

export default NewUsersCountByDateRange;
