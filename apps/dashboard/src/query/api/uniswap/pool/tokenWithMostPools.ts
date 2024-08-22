import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { PoolTokensWithMostPools, Version } from "../../../types";

export const TOKEN_WITH_MOST_POOLS_KEY = ["TOKEN_WITH_MOST_POOLS_KEY"];

const query = (chainId: number, version: Version) =>
  qs.stringify({
    chainId: chainId,
    version: version,
  });

export const getTokensWithMostPools = async (
  chainId: number,
  version: Version
): Promise<PoolTokensWithMostPools[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.TOKENS_WITH_MOST_POOLS_ROUTE + "?" + query(chainId, version)
    )
  );

export const useTokensWithMostPools = (chainId: number, version: Version) => {
  const query = useQuery({
    queryKey: [TOKEN_WITH_MOST_POOLS_KEY, version],
    queryFn: () => getTokensWithMostPools(chainId || 1, version),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchTokens: query.refetch,
  };
};
