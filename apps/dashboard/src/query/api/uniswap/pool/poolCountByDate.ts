import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ROUTES } from "../../../routes";
import { backendInstance, controlledAxiosPromise } from "../../../axios";
import { Version, DateEnum, PoolCreatedByDate } from "../../../types";

export const POOL_COUNT_BY_DATE_KEY = ["POOL_COUNT_BY_DATE_KEY"];

const query = (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    date: date,
    startDate: startDate,
    endDate: endDate,
  });

export const getPoolCountByDate = async (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<PoolCreatedByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.POOL_COUNT_BY_DATE + "?" + query(chainId, date, startDate, endDate)
    )
  );

export const usePoolCountByDate = (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [POOL_COUNT_BY_DATE_KEY, date, startDate, endDate],
    queryFn: () => getPoolCountByDate(chainId || 1, date, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchPoolCount: query.refetch,
  };
};
