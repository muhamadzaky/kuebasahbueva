"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type ParamsState = Record<string, string>;

export function usePageSearchParams<T extends ParamsState>(
  defaultState: T = {} as T,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState = useMemo(() => {
    const result = {} as T;
    (Object.keys(defaultState) as (keyof T)[]).forEach((key) => {
      result[key] = (searchParams.get(String(key)) ??
        defaultState[key]) as T[keyof T];
    });
    return result;
  }, [searchParams, defaultState]);

  const updateState = useCallback(
    (updatedState: Partial<T>, action: "replace" | "push" = "replace") => {
      const paramsToApply = new URLSearchParams(searchParams.toString());
      const mergedState = { ...currentState, ...updatedState };

      Object.entries(mergedState).forEach(([key, val]) => {
        const isDefault = String(defaultState[key as keyof T]) === String(val);
        if (!val || isDefault) {
          paramsToApply.delete(key);
        } else {
          paramsToApply.set(key, String(val));
        }
      });

      const search = paramsToApply.toString();
      const newUrl = search ? `${pathname}?${search}` : pathname;

      if (action === "replace") {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [currentState, defaultState, pathname, router, searchParams],
  );

  return {
    ...currentState,
    update: updateState,
    get: (key: string) => searchParams.get(key) ?? defaultState[key as keyof T],
    has: (key: string) => searchParams.has(key),
    toString: () => "?" + searchParams.toString(),
  };
}
