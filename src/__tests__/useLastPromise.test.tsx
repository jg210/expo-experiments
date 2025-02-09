import { renderHook, waitFor } from "@testing-library/react-native";
import { useLastPromise } from "../useLastPromise";

describe("useLastPromise", () => {
  
  it("passes value from promise to commit", async () => {
    const value = "testing 123";
    const promise = async () => value;
    const commit = jest.fn();
    const { result } = renderHook(() => useLastPromise(promise, [], commit));
    expect(result.current).toBe(undefined);
    await waitFor(() => expect(commit).toHaveBeenCalledWith(value));
  });

});
