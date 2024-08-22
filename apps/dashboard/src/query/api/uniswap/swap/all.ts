import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { Activity } from "../../../types";

export const ALL_SWAPS_KEY = ["ALL_SWAPS_KEY"];

const query = (
  chainId: number,
  page: number,
  limit: number,
  token?: string,
  sender?: string,
  poolAddress?: string,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    page: page,
    limit: limit,
    token: token,
    sender: sender,
    poolAddress: poolAddress,
    startDate: startDate,
    endDate: endDate,
  });

export const getAllSwaps = async (
  chainId: number,
  page: number,
  limit: number,
  token?: string,
  sender?: string,
  poolAddress?: string,
  startDate?: Date,
  endDate?: Date
): Promise<Activity> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.ALL_SWAPS_ROUTE +
        "?" +
        query(
          chainId,
          page,
          limit,
          token && token.length > 0 ? token : undefined,
          sender && sender.length > 0 ? sender : undefined,
          poolAddress && poolAddress.length > 0 ? poolAddress : undefined,
          startDate,
          endDate
        )
    )
  );

export const useAllSwaps = (
  chainId: number,
  page: number,
  limit: number,
  token?: string,
  sender?: string,
  poolAddress?: string,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [
      ALL_SWAPS_KEY,
      chainId,
      page,
      limit,
      token,
      sender,
      poolAddress,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getAllSwaps(
        chainId || 1,
        page || 1,
        limit || 20,
        token,
        sender,
        poolAddress,
        startDate,
        endDate
      ),
  });

  useEffect(() => {
    query.refetch();
  }, [page]);

  return {
    isLoading: query.isPending,
    swaps: query.data?.swaps,
    pagination: query.data?.pagination,
    refetchAllSwaps: query.refetch,
  };
};
