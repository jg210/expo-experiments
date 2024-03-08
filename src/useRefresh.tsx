import { useRef, useState } from "react";

// Connects https://reactnative.dev/docs/flatlist onRefresh()/refreshing with refetch()
// returned by https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
export function useRefresh<T>(refetch: () => Promise<T>) {
  const pendingRefreshCount = useRef(0);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    pendingRefreshCount.current++;
    try {
      await refetch();
    } finally {
      pendingRefreshCount.current--;
      if (pendingRefreshCount.current === 0) {
        setRefreshing(false);
      }
    }
  }

  return {
    refreshing,
    onRefresh,
  };
}
