import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { PoolPriceAndVolume } from "../../../types";

export const POOL_PRICE_AND_VOLUME_KEY = ["POOL_PRICE_AND_VOLUME_KEY"];

const query = (chainId: number, poolAddress: string) =>
  qs.stringify({
    chainId: chainId,
    poolAddress: poolAddress,
  });

export const getPoolPriceAndVolume = async (
  chainId: number,
  poolAddress: string
): Promise<PoolPriceAndVolume[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_PRICE_AND_VOLUME_ROUTE + "?" + query(chainId, poolAddress)
    )
  );

export const usePoolPriceAndVolume = (chainId: number, poolAddress: string) => {
  const query = useQuery({
    queryKey: POOL_PRICE_AND_VOLUME_KEY,
    queryFn: () => getPoolPriceAndVolume(chainId || 1, poolAddress),
  });

  return {
    isLoading: query.isPending,
    poolPriceAndVolume: query.data,
    refetchPoolPriceAndVolume: query.refetch,
  };
};
