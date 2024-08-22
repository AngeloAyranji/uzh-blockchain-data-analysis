import qs from "qs";
import { useQuery } from "@tanstack/react-query";
import { DateEnum } from "../../../types/uniswap";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { ROUTES } from "../../../routes";
import { PoolFlowsByDate } from "../../../types/poolFlows";

export const POOL_FLOW_BY_DATE_RANGE_KEY = ["POOL_FLOW_BY_DATE_RANGE_KEY"];

const query = (
  chainId: number,
  poolAddress: string,
  type: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    poolAddress: poolAddress,
    type: type,
    date: date,
    startDate: startDate,
    endDate: endDate,
  });

export const getPoolFlow = async (
  chainId: number,
  poolAddress: string,
  type: "ADD" | "REMOVE",
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<PoolFlowsByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_FLOW_ROUTE +
        "?" +
        query(chainId, poolAddress, type, date, startDate, endDate)
    )
  );

export const usePoolFlowByDateRange = (
  chainId: number,
  poolAddress: string,
  type: "ADD" | "REMOVE",
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      POOL_FLOW_BY_DATE_RANGE_KEY,
      chainId,
      poolAddress,
      type,
      date,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPoolFlow(chainId || 1, poolAddress, type, date, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolFlow: query.refetch,
  };
};
