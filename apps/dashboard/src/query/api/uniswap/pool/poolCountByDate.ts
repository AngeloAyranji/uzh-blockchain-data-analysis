import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import { ROUTES } from '../../../routes'
import { backendInstance, controlledAxiosPromise } from '../../../axios';
import { Version, DateEnum, PoolCreatedByDate } from '../../../types';

export const POOL_COUNT_BY_DATE_KEY = ['POOL_COUNT_BY_DATE_KEY'];

const query = (chainId: number, date: DateEnum) =>
    qs.stringify({
        chainId: chainId,
        date: date
    });

export const getPoolCountByDate = async (chainId: number, date: DateEnum): Promise<
    PoolCreatedByDate[]
> =>
    controlledAxiosPromise(
        backendInstance.get(ROUTES.POOL_COUNT_BY_DATE + '?' + query(chainId, date))
    );

export const usePoolCountByDate = (chainId: number, date: DateEnum,) => {

    const query = useQuery({
        queryKey: [POOL_COUNT_BY_DATE_KEY, date],
        queryFn: () => getPoolCountByDate(chainId || 1, date),
    });

    return {
        isLoading: query.isPending,
        data: query.data,
        refetchAllWorkspaces: query.refetch,
    };
};