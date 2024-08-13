import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import { ROUTES } from '../../../routes'
import { backendInstance, controlledAxiosPromise } from '../../../axios';
import { TopActivePools } from '../../../types';

export const TOP_ACTIVE_POOLS_KEY = ['TOP_ACTIVE_POOLS_KEY'];

const query = (chainId: number) =>
    qs.stringify({
        chainId: chainId,
    });

export const getTopActivePools = async (chainId: number): Promise<
    TopActivePools[]
> =>
    controlledAxiosPromise(
        backendInstance.get(ROUTES.TOP_ACTIVE_POOLS_ROUTE + '?' + query(chainId))
    );

export const useTopActivePools = (chainId: number) => {

    const query = useQuery({
        queryKey: TOP_ACTIVE_POOLS_KEY,
        queryFn: () => getTopActivePools(chainId || 1),
    });

    return {
        isLoading: query.isPending,
        data: query.data,
        refetchAllWorkspaces: query.refetch,
    };
};