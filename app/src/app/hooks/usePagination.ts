import {useState, useCallback} from 'react';

interface UsePaginationProps<T> {
  fetchData: (page: number) => Promise<{
    data: T[];
    total: number;
    hasMore?: boolean;
  }>;
  initialPage?: number;
  pageSize?: number;
}

interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => Promise<void>;
  onLoadMore: () => Promise<void>;
  reset: () => void;
}

export function usePagination<T>({
  fetchData,
  initialPage = 1,
  pageSize = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(
    async (currentPage: number, shouldAppend = false) => {
      try {
        setLoading(true);
        const response = await fetchData(currentPage);

        if (shouldAppend) {
          setData(prev => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }

        setHasMore(response.hasMore ?? response.data.length === pageSize);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchData, pageSize],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(initialPage);
    await loadData(initialPage);
  }, [initialPage, loadData]);

  const onLoadMore = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadData(nextPage, true);
    }
  }, [loading, hasMore, page, loadData]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setLoading(false);
    setRefreshing(false);
  }, [initialPage]);

  return {
    data,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    onLoadMore,
    reset,
  };
}
