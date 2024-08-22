import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";
import { DateEnum, PoolSwapCountByAddressDate } from "../../types";

export const POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY = [
  "POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY",
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
    date: date,
    startDate: startDate,
    endDate: endDate,
    poolAddress: poolAddress,
  });

export const getPoolSwapCount = async (
  chainId: number,
  poolAddress: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<PoolSwapCountByAddressDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_SWAP_COUNT +
        "?" +
        query(chainId, poolAddress, date, startDate, endDate)
    )
  );

export const usePoolSwapCountByDateRangeAddress = (
  chainId: number,
  poolAddress: string,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY,
      poolAddress,
      date,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPoolSwapCount(chainId || 1, poolAddress, date, startDate, endDate),
    enabled: !!poolAddress,
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolSwapCount: query.refetch,
  };
};
