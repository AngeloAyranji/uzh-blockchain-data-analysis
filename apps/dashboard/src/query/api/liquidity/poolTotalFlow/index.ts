import qs from "qs";
import { useQuery } from "@tanstack/react-query";
import { DateEnum } from "../../../types/uniswap";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { ROUTES } from "../../../routes";
import { PoolFlowsByDate } from "../../../types/poolFlows";

export const POOL_TOTAL_FLOW_BY_DATE_RANGE_KEY = [
  "POOL_TOTAL_FLOW_BY_DATE_RANGE_KEY",
];

const query = (
  chainId: number,
  poolAddress: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    poolAddress: poolAddress,
    date: date,
    startDate: startDate,
    endDate: endDate,
  });

export const getPoolTotalFlow = async (
  chainId: number,
  poolAddress: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<PoolFlowsByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_TOTAL_FLOW_ROUTE +
        "?" +
        query(chainId, poolAddress, date, startDate, endDate)
    )
  );

export const usePoolTotalFlowByDateRange = (
  chainId: number,
  poolAddress: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      POOL_TOTAL_FLOW_BY_DATE_RANGE_KEY,
      chainId,
      poolAddress,
      date,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPoolTotalFlow(chainId || 1, poolAddress, date, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolTotalFlow: query.refetch,
  };
};
