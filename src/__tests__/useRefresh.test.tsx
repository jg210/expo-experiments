import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useRefresh } from "../useRefresh";

describe("useRefresh", () => {
  it("refetch resolves immediately", async () => {
    const refetch = async () => {};
    const { result } = renderHook(() => useRefresh(refetch));
    expect(result.current.refreshing).toEqual(false);
    await act(async () => {
      await result.current.onRefresh();
      expect(result.current.refreshing).toEqual(true);
    });
    waitFor(() => expect(result.current.refreshing).toEqual(false));
  });

  it("refetch resolves after 100ms", async () => {
    const refetch = () => {
      return new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
    };
    const { result } = renderHook(() => useRefresh(refetch));
    expect(result.current.refreshing).toEqual(false);
    await act(async () => {
      await result.current.onRefresh();
      expect(result.current.refreshing).toEqual(true);
    });
    waitFor(() => expect(result.current.refreshing).toEqual(false));
  });
});
