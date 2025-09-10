import {useState, useCallback, useEffect} from 'react';
import {NetWorkService} from '../library/networking';

interface UseInfiniteListParams<T> {
  pageSize?: number;
  url: string;
  params?: Record<string, string>;
  paramsStringKey?: string;
}

interface UseInfiniteListReturn<T> {
  data: T[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useInfiniteList<T>({
  pageSize = 10,
  url,
  params = {},
  paramsStringKey = '',
}: UseInfiniteListParams<T>): UseInfiniteListReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (currentPage: number, isRefreshing = false) => {
      try {
        setError(null);
        setLoading(true);
        const response = await NetWorkService.Get({
          url: url || '',
          params: {
            ...params,
            page: currentPage,
            limit: pageSize,
          },
        });
        setLoading(false);

        if (isRefreshing) {
          setData(response.data?.data || response?.data);
        } else {
          setData(prev => [
            ...prev,
            ...(response.data?.data || response?.data),
          ]);
        }
        // console.log('response.pagination', response.data);
        setHasMore(
          response.data?.pagination?.totalPages >
            response.data?.pagination?.page,
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize, url, paramsStringKey],
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    await fetchData(page + 1);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [loading, hasMore, page, fetchData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(1, true);
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    loading,
    refreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
