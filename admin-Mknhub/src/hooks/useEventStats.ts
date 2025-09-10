import { useCustom } from "@refinedev/core";

interface EventStats {
  total: number;
  mkn_total: number;
  mkn_by_type: Record<string, number>;
  boundary_near: number;
  boundary_crossed: number;
  open: number;
  resolved: number;
}

interface EventStatsQuery {
  from?: string;
  to?: string;
  ship_code?: string;
}

export const useEventStats = (query?: EventStatsQuery) => {
  const { data, isLoading, error, refetch } = useCustom<EventStats>({
    url: "v1/ship-notifications/events/stats",
    method: "get",
    config: {
      query,
    },
    queryOptions: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  return {
    data: data?.data,
    isLoading,
    error: error?.message,
    refetch,
  };
};
