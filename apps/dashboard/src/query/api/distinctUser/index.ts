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

export const getDistinctUsers = async (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<DistinctUsersByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.DISTINCT_USERS_BY_DATE_RANGE +
        "?" +
        query(chainId, date, startDate, endDate)
    )
  );

export const useDistinctUsersByDateRange = (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [DISTINCT_USER_BY_DATE_RANGE_KEY, date, startDate, endDate],
    queryFn: () => getDistinctUsers(chainId || 1, date, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchDistinctUsers: query.refetch,
  };
};
