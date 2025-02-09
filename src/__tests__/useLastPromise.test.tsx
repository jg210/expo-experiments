import { renderHook, waitFor } from "@testing-library/react-native";
import { CommitFunction, PromiseFunction, useLastPromise } from "../useLastPromise";

import { expect, jest } from '@jest/globals';
import React from "react";

describe("useLastPromise", () => {
  
  it("passes value from promise to commit", async () => {
    const value = "testing 123";
    const promise: PromiseFunction<typeof value> = async () => value;
    const commit = jest.fn<CommitFunction<typeof value>>();
    const { result } = renderHook(() => useLastPromise(promise, [], commit));
    expect(result.current).toBe(undefined);
    await waitFor(() => expect(commit).toHaveBeenCalledWith(value));
  });

  it("passes deps to useEffect", async () => {
    const [ x, y, z ] = [1, 2, 3];
    type Value = number;
    const promise: PromiseFunction<Value> = async () => x + y + z;
    const commit = jest.fn<CommitFunction<Value>>();
    const useEffectMock = jest.spyOn(React, "useEffect");
    const deps = [x, y, z];
    renderHook(() => useLastPromise(promise, deps, commit));
    expect(useEffectMock).toHaveBeenCalledWith(expect.any(Function), deps);
  });

});
