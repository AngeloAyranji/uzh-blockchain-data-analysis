import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { DistinctUsersByDate } from "../../types";
import { backendInstance, controlledAxiosPromise } from "../../axios";
import { ROUTES } from "../../routes";

export const DISTINCT_USER_BY_DATE_RANGE_KEY = [
  "DISTINCT_USER_BY_DATE_RANGE_KEY",
];

const query = (chainId: number, startDate?: Date) =>
  qs.stringify({
    chainId: chainId,
    startDate: startDate,
  });

export const getDistinctUsers = async (
  chainId: number,
  startDate?: Date
): Promise<DistinctUsersByDate[]> =>
  controlledAxiosPromise(
    backendInstance.get(
      ROUTES.DISTINCT_USERS_BY_DATE_RANGE + "?" + query(chainId, startDate)
    )
  );

export const useDistinctUsersByDateRange = (
  chainId: number,
  startDate?: Date
) => {
  const query = useQuery({
    queryKey: [DISTINCT_USER_BY_DATE_RANGE_KEY, startDate],
    queryFn: () => getDistinctUsers(chainId || 1, startDate),
  });

  return {
    isLoading: query.isPending,
    data: query.data,
    refetchDistinctUsers: query.refetch,
  };
};
