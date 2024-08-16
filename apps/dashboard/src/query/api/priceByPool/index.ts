import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";
import { PriceByPool } from "../../types";

export const PRICE_POOL_BY_DATE_RANGE_ADDRESS_KEY = [
  "PRICE_POOL_BY_DATE_RANGE_ADDRESS_KEY",
];

const query = (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    poolAddress: poolAddress,
    startDate: startDate,
    endDate: endDate,
  });

export const getPriceByPool = async (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
): Promise<PriceByPool[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_PRICE_BY_ADDRESS_DATE_RANGE +
        "?" +
        query(chainId, poolAddress, startDate, endDate)
    )
  );

export const usePoolPriceByAddressDateRange = (
  chainId: number,
  poolAddress: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      PRICE_POOL_BY_DATE_RANGE_ADDRESS_KEY,
      poolAddress,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPriceByPool(chainId || 1, poolAddress, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolPrice: query.refetch,
  };
};
