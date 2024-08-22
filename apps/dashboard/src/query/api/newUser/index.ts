import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { DateEnum, NewUsersByDate } from "../../types";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";

export const NEW_USER_BY_DATE_RANGE_KEY = ["NEW_USER_BY_DATE_RANGE_KEY"];

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

export const getNewUsers = async (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
): Promise<NewUsersByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.NEW_USERS_BY_DATE_RANGE +
        "?" +
        query(chainId, date, startDate, endDate)
    )
  );

export const useNewUsersByDateRange = (
  chainId: number,
  date: DateEnum,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [NEW_USER_BY_DATE_RANGE_KEY, date, startDate, endDate],
    queryFn: () => getNewUsers(chainId || 1, date, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchNewUsers: query.refetch,
  };
};
