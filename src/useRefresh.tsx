import { useState } from "react";

// Connects https://reactnative.dev/docs/flatlist onRefresh()/refreshing with refetch()
// returned by https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
export function useRefresh<T>(refetch: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

  return {
    refreshing,
    onRefresh,
  };
}
