import { useRef, useState } from "react";

export type UseRefreshResult = { refreshing: boolean, onRefresh: () => Promise<void>}

// Connects https://reactnative.dev/docs/flatlist onRefresh()/refreshing with refetch()
// returned by https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
export function useRefresh<T>(refetch: () => Promise<T>) : UseRefreshResult {
  // The synchronous onRefresh() calls increment the counter, and the
  // asynchronous refetch() Promise resolution decrements the counter.
  const pendingRefreshCount = useRef(0);
  // True if and only if count is non-zero.
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
