import qs from "qs";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "../../routes";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { PairPriceByAddresses } from "../../../query/types/PairPriceByAddresses";

export const PAIR_PRICE_BY_DATE_RANGE_ADDRESS_KEY = [
  "PAIR_PRICE_BY_DATE_RANGE_ADDRESS_KEY",
];

const query = (
  chainId: number,
  token0: string,
  token1: string,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    token0: token0,
    token1: token1,
    startDate: startDate,
    endDate: endDate,
  });

export const getPairPrice = async (
  chainId: number,
  token0: string,
  token1: string,
  startDate?: Date,
  endDate?: Date
): Promise<PairPriceByAddresses[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.PAIR_PRICE_BY_ADDRESS_DATE_RANGE +
        "?" +
        query(chainId, token0, token1, startDate, endDate)
    )
  );

export const usePairPriceByAddressDateRange = (
  chainId: number,
  token0: string,
  token1: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      PAIR_PRICE_BY_DATE_RANGE_ADDRESS_KEY,
      token0,
      token1,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getPairPrice(chainId || 1, token0, token1, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPairPrice: query.refetch,
  };
};
