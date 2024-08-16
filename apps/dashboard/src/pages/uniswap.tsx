import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { FiExternalLink } from "react-icons/fi";
import { DateEnum } from "../query/types";
import DistinctUsersCountByDateRange from "./components/DistinctUsersCard";
import NewUsersCountByDateRange from "./components/NewUsersCard";
import PoolCreatedCard from "./components/PoolCreatedCard";
import PairPriceCardByDateAddress from "./components/PricePairCard";
import PoolPriceCardByDateAddress from "./components/PricePoolCard";
import SwapPoolCountCardByDateAddress from "./components/SwapPoolCountCard";
import TableCard from "./components/TableCard";
import TokenWithMostPools from "./components/TokenWithMostPools";
import TopActiveAddresses from "./components/TopActiveAddresses";
import TopActivePools from "./components/TopActivePools";
import TotalPoolCount from "./components/TotalPoolCount";
import { DatePickerWithRange } from "./components/ui/datePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function Uniswap() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const [currDate, setCurrDate] = useState("");
  const [selectedDapp, setSelectedDapp] = useState("Uniswap");
  const [timeframe, setTimeframe] = useState<DateEnum>(DateEnum.DAY);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const date = Date.now();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
    setCurrDate(formattedDate);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className=" bg-[#F5F5F5] font-Roboto min-h-screen min-w-screen flex justify-start items-center flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center flex-col p-8 rounded-b-xl sm:flex-row gap-4 w-full mb-4 shadow-lg">
          <div className="flex space-x-4 justify-center items-center">
            <h1 className="text-3xl font-extrabold text-black tracking-wide uppercase">
              Uniswap Dashboard
            </h1>
            <FiExternalLink
              className="icon hover:text-black hover:scale-125 transition-all cursor-pointer w-6 h-6"
              onClick={() => {
                window.open("https://app.uniswap.org/");
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-5">
            <p className="font-bold text-xl">{currDate}</p>
            <Select value={selectedDapp} onValueChange={setSelectedDapp}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dapp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Uniswap">Uniswap</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Body */}
        <div className="p-12 w-full">
          <Tabs defaultValue="general" >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
            </TabsList>
            {/* Filters */}
            <div className="flex flex-col  mt-5 items-center py-5 bg-white rounded-2xl shadow-md sm:w-[70%] mx-auto">
              <h2 className="mb-5 font-black text-2xl">FILTERS</h2>
              <div className="flex flex-row justify-around w-full items-center ">
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-lg font-bold">Date Range</p>
                  <DatePickerWithRange date={date} setDate={setDate} />
                </div>
                {/* Timeframe */}
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-lg font-bold">Timeframe</p>
                  <Select value={timeframe} onValueChange={(value: DateEnum) => setTimeframe(value)}>
                    <SelectTrigger unselectable="on" className="w-[180px]">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAY">Day</SelectItem>
                      <SelectItem value="WEEK">Week</SelectItem>
                      <SelectItem value="MONTH">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>

            <TabsContent value="general">

              <div className="sm:w-[70%] flex items-center justify-center mx-auto mt-10">
                <TotalPoolCount />
              </div>

              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-6 h-full flex flex-1">
                  <TokenWithMostPools title="Token With Most Pools (V2)" version="V2" />
                </div>
                <div className="col-span-6 h-full flex flex-1">
                  <TokenWithMostPools title="Token With Most Pools (V3)" version="V3" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-12">
                  <PoolCreatedCard title="Pool Created Count" frequency={timeframe} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-12">
                  <NewUsersCountByDateRange title="New User Count" startDate={date?.from} endDate={date?.to} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-12">
                  <DistinctUsersCountByDateRange title="Distinct User Count" startDate={date?.from} />
                </div>
              </div>

            </TabsContent>
            {/* Trades */}
            <TabsContent value="trades">
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-6">
                  <TopActivePools title="Top Active Pools (V2/V3)" />
                </div>
                <div className="col-span-6">
                  <TopActiveAddresses title="Top Active Adresses (V2/V3)" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className=" col-span-12">
                  <SwapPoolCountCardByDateAddress title="Swap Pool Count By Address and Date Range" startDate={date?.from} endDate={date?.to} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className=" col-span-12">
                  <PoolPriceCardByDateAddress frequency={timeframe} title="Pool Price By Pool Address and Date Range" startDate={date?.from} endDate={date?.to} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className=" col-span-12">
                  <PairPriceCardByDateAddress frequency={timeframe} title="Pair Price By Tokens Address and Date Range" startDate={date?.from} endDate={date?.to} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full mt-10 mb-10">
                <div className="col-span-12">
                  <TableCard />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default Uniswap;
