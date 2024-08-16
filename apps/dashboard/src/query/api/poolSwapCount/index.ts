import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";
import { PoolSwapCountByAddressDate } from "../../types";

export const POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY = [
  "POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY",
];

const query = (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    startDate: startDate,
    endDate: endDate,
    poolAddress: poolAddress,
  });

export const getPoolSwapCount = async (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
): Promise<PoolSwapCountByAddressDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_SWAP_COUNT +
        "?" +
        query(chainId, poolAddress, startDate, endDate)
    )
  );

export const usePoolSwapCountByDateRangeAddress = (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      POOL_SWAP_COUNT_BY_DATE_ADDRESS_KEY,
      poolAddress,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPoolSwapCount(chainId || 1, poolAddress, startDate, endDate),
    enabled: !!poolAddress,
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolSwapCount: query.refetch,
  };
};
