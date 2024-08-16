import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { NewUsersByDate } from "../../types";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";

export const NEW_USER_BY_DATE_RANGE_KEY = ["NEW_USER_BY_DATE_RANGE_KEY"];

const query = (chainId: number, startDate?: Date, endDate?: Date) =>
  qs.stringify({
    chainId: chainId,
    startDate: startDate,
    endDate: endDate,
  });

export const getNewUsers = async (
  chainId: number,
  startDate?: Date,
  endDate?: Date
): Promise<NewUsersByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.NEW_USERS_BY_DATE_RANGE + "?" + query(chainId, startDate, endDate)
    )
  );

export const useNewUsersByDateRange = (
  chainId: number,
  startDate?: Date,
  endDate?: Date
) => {
  const query = useQuery({
    queryKey: [NEW_USER_BY_DATE_RANGE_KEY, startDate, endDate],
    queryFn: () => getNewUsers(chainId || 1, startDate, endDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchNewUsers: query.refetch,
  };
};
