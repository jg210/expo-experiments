import { useEffect } from "react";

export type PromiseFunction<T> = () => Promise<T>;
export type CommitFunction<T> = (value: T) => void;

// Ensures racing promises can't be reordered.
//
// Based on pattern from https://react.dev/learn/synchronizing-with-effects#fetching-data
//
// react-hooks/exhaustive-deps is configured with additionalHooks to check the deps.
// It expects first and second args to look like useEffect's args, so promise and deps must be
// first and second argument. It won't check commit function for missing deps.
//
// promise - returns Promise that depends on just deps
// deps - same as for useEffect
// commit - given the value returned by promise unless there's a newer render in progress. If it depends on any values, they'd need to go in deps too.
export function useLastPromise<T>(
  promise: PromiseFunction<T>,
  deps: React.DependencyList,
  commit: CommitFunction<T>) {
    useEffect(
      () => {
        let ignore = false;
        promise().then(value => {
          if (!ignore) {
            commit(value);
          }
        });
        return () => { ignore = true };
      },
      deps // eslint-disable-line react-hooks/exhaustive-deps
    );
};
  