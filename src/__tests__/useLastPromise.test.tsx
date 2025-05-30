import { render, renderHook, waitFor } from "@testing-library/react-native";
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

  it("ignores promise1 if not resolved until next render", async () => {
    type Value = number;
    type Props = {
        promise: PromiseFunction<Value>,
        commit: CommitFunction<Value>
    };
    const TestHarness = ({ promise, commit }: Props) => {
        useLastPromise(promise, [promise, commit], commit)
        return <div></div>;
    }
    let promise1Resolver: ((value: number) => void) | null = null;
    const promise1Value = 234234;
    const promise2Value: Value = Math.random();
    expect(promise1Value).not.toEqual(promise2Value);
    const promise1: PromiseFunction<Value> = () => new Promise((resolve, _reject) => { promise1Resolver = resolve }); // slow
    const promise2: PromiseFunction<Value> = async () => promise2Value; // fast
    const commit1 = jest.fn<CommitFunction<Value>>()
    const commit2 = jest.fn<CommitFunction<Value>>()
    const {rerender } = render(
        <TestHarness promise={promise1} commit={commit1} />
    );
    rerender(
        <TestHarness promise={promise2} commit={commit2} />
    );
    await waitFor(() => expect(promise1Resolver).toBeDefined());
    promise1Resolver!(promise1Value);
    expect(commit1).toHaveBeenCalledTimes(0);
    expect(commit2).toHaveBeenCalledWith(promise2Value);
  });

  it("ignores promise if not resolved until after unmount", async () => {
    type Value = number;
    type Props = {
        promise: PromiseFunction<Value>,
        commit: CommitFunction<Value>
    };
    const TestHarness = ({ promise, commit }: Props) => {
        useLastPromise(promise, [promise, commit], commit)
        return <div></div>;
    }
    let promise1Resolver: ((value: number) => void) | null = null;
    const promise1Value = 234234;
    const promise1: PromiseFunction<Value> = () => new Promise((resolve, _reject) => { promise1Resolver = resolve }); // slow
    const commit1 = jest.fn<CommitFunction<Value>>()
    const { unmount } = render(
      <TestHarness promise={promise1} commit={commit1} />
    );
    unmount();
    await waitFor(() => expect(promise1Resolver).toBeDefined());
    promise1Resolver!(promise1Value);
    expect(commit1).toHaveBeenCalledTimes(0);
  });

});
