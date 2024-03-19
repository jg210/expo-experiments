import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useRefresh } from "../useRefresh";
import { times } from "lodash";

describe("useRefresh", () => {
  it("refetch resolves immediately", async () => {
    const refetch = jest.fn(async () => {});
    const { result } = renderHook(() => useRefresh(refetch));
    expect(refetch).toHaveBeenCalledTimes(0);
    expect(result.current.refreshing).toEqual(false);
    await act(async () => {
      await result.current.onRefresh();
      expect(result.current.refreshing).toEqual(true);
    });
    waitFor(() => expect(result.current.refreshing).toEqual(false));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("refetch resolves after 100ms", async () => {
    const refetch = jest.fn(() => {
      return new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
    });
    const { result } = renderHook(() => useRefresh(refetch));
    expect(refetch).toHaveBeenCalledTimes(0);
    expect(result.current.refreshing).toEqual(false);
    await act(async () => {
      await result.current.onRefresh();
      expect(result.current.refreshing).toEqual(true);
    });
    waitFor(() => expect(result.current.refreshing).toEqual(false));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  describe("multiple refetch() promises pending at same time", () => {
    const multiplePendingRefetches = async () => {
      // Set up a refetch() function that stores resolve function for deferred resolution, and that
      // uses jest.fn() so can track that this function is called.
      const toResolve: (() => void)[] = [];
      const refetch = jest.fn(() => {
        return new Promise<void>((resolve, _reject) => {
          toResolve.push(resolve);
        });
      });

      // SUT
      const { result } = renderHook(() => useRefresh(refetch));

      // Nothing's happened yet...
      expect(refetch).toHaveBeenCalledTimes(0);
      expect(result.current.refreshing).toEqual(false);

      // Set up some unresolved refreshes.
      const n = 3;
      await act(async () => {
        times(n, async () => {
          await result.current.onRefresh();
          expect(result.current.refreshing).toEqual(true);
        });
      });
      expect(refetch).toHaveBeenCalledTimes(3);
      expect(result.current.refreshing).toEqual(true);

      // Resolve all the promises...
      await act(async () => {
        toResolve.forEach((resolve) => resolve());
      });

      // ...then the refreshing state should become false.
      expect(result.current.refreshing).toEqual(false);
    };

    it("resolved in order of creation", async () => {
      multiplePendingRefetches();
    });
  });
});
