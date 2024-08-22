import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { TopActivePools } from "../../../types";

export const TOP_ACTIVE_POOLS_KEY = ["TOP_ACTIVE_POOLS_KEY"];

const query = (
  chainId: number,
  version: "V2" | "V3",
  limit: number,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    version: version,
    limit: limit,
    startDate: startDate,
    endDate,
  });

export const getTopActivePools = async (
  chainId: number,
  version: "V2" | "V3",
  limit: number,
  startDate?: Date,
  endDate?: Date
): Promise<TopActivePools[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.TOP_ACTIVE_POOLS_ROUTE +
        "?" +
        query(chainId, version, limit, startDate, endDate)
    )
  );

export const useTopActivePools = (
  chainId: number,
  version: "V2" | "V3",
  limit: number,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: TOP_ACTIVE_POOLS_KEY,
    queryFn: () =>
      getTopActivePools(chainId || 1, version, limit, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchTopActivePools: query.refetch,
  };
};
