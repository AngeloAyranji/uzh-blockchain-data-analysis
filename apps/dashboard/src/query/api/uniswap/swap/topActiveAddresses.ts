import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { TopActiveAddresses } from "../../../types";

export const TOP_ACTIVE_ADDRESSES_KEY = ["TOP_ACTIVE_ADDRESSES_KEY"];

const query = (chainId: number, startDate?: Date, endDate?: Date) =>
  qs.stringify({
    chainId: chainId,
    startDate: startDate,
    endDate: endDate,
  });

export const getTopActiveAddresses = async (
  chainId: number,
  startDate?: Date,
  endDate?: Date
): Promise<TopActiveAddresses[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.TOP_ACTIVE_ADDRESSES_ROUTE +
        "?" +
        query(chainId, startDate, endDate)
    )
  );

export const useTopActiveAddresses = (
  chainId: number,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [TOP_ACTIVE_ADDRESSES_KEY, startDate, endDate],
    queryFn: () => getTopActiveAddresses(chainId || 1, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchTopActiveAddresses: query.refetch,
  };
};
