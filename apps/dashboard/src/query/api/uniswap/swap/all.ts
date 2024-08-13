import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import { ROUTES } from '../../../routes'
import { backendInstance, controlledAxiosPromise } from '../../../axios';
import { Activity } from '../../../types';

export const ALL_SWAPS_KEY = ['ALL_SWAPS_KEY'];

const query = (chainId: number, page: number, limit: number) =>
    qs.stringify({
        chainId: chainId,
        page: page,
        limit: limit,
    });

export const getAllSwaps = async (chainId: number, page: number, limit: number): Promise<
    Activity
> =>
    controlledAxiosPromise(
        backendInstance.get(ROUTES.ALL_SWAPS_ROUTE + '?' + query(chainId, page, limit))
    );

export const useAllSwaps = (chainId: number, page: number, limit: number) => {

    const query = useQuery({
        queryKey: ALL_SWAPS_KEY,
        queryFn: () => getAllSwaps(chainId || 1, page || 1, limit || 20),
    });

    useEffect(() => {
        query.refetch();
    }, [page]);

    return {
        isLoading: query.isPending,
        swaps: query.data?.swaps,
        pagination: query.data?.pagination,
        refetchAllWorkspaces: query.refetch,
    };
};