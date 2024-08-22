import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { BaseResponse, PoolTotalCount, Version } from "../../../types";

export const POOL_COUNT_KEY = ["POOL_COUNT_KEY"];

const query = (chainId: number, version: Version) =>
  qs.stringify({
    chainId: chainId,
    version: version,
  });

export const getPoolTotalCount = async (
  chainId: number,
  version: Version
): Promise<PoolTotalCount[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.TOTAL_COUNT_ROUTE + "?" + query(chainId, version)
    )
  );

export const usePoolTotalCount = (chainId: number, version?: Version) => {
  const query = useQuery({
    queryKey: POOL_COUNT_KEY,
    queryFn: () => getPoolTotalCount(chainId || 1, version),
  });

  return {
    isLoading: query.isPending,
    poolTotalCount: query.data,
    refetchPoolTotalCount: query.refetch,
  };
};
