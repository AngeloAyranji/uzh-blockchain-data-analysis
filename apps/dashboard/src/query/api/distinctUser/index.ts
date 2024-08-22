import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { DateEnum, DistinctUsersByDate } from "../../types";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";

export const DISTINCT_USER_BY_DATE_RANGE_KEY = [
  "DISTINCT_USER_BY_DATE_RANGE_KEY",
];

const query = (
  chainId: number,
  timeframe: DateEnum,
  startDate?: Date,
  endDate?: Date
) =>
  qs.stringify({
    chainId: chainId,
    timeframe: timeframe,
    startDate: startDate,
    endDate: endDate,
  });

export const getDistinctUsers = async (
  chainId: number,
  timeframe: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<DistinctUsersByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.DISTINCT_USERS_BY_DATE_RANGE +
        "?" +
        query(chainId, timeframe, startDate, endDate)
    )
  );

export const useDistinctUsersByDateRange = (
  chainId: number,
  timeframe: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [DISTINCT_USER_BY_DATE_RANGE_KEY, timeframe, startDate, endDate],
    queryFn: () => getDistinctUsers(chainId || 1, timeframe, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchDistinctUsers: query.refetch,
  };
};
