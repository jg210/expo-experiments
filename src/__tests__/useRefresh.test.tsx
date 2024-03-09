import { act, renderHook, waitFor } from "@testing-library/react-native";
//import { times } from "lodash";

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

  // it("multiple onRefresh calls before refetch resolves", async () => {
  //   let delay = 100;
  //   const refetch = jest.fn(() => {
  //     return new Promise<void>((resolve) => {
  //       setTimeout(() => resolve(), delay);
  //       delay *= 0.8;
  //     });
  //   });
  //   const { result } = renderHook(() => useRefresh(refetch));
  //   expect(refetch).toHaveBeenCalledTimes(0);
  //   expect(result.current.refreshing).toEqual(false);
  //   const numberOfRefreshes = 3;
  //   await act(async () => {
  //     times(numberOfRefreshes, async () => {
  //       await result.current.onRefresh();
  //       expect(result.current.refreshing).toEqual(true);
  //     });
  //   });
  //   expect(refetch).toHaveBeenCalledTimes(numberOfRefreshes);
  //   waitFor(() => expect(result.current.refreshing).toEqual(false));
  // });
});
