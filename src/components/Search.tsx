"use client";

import { useMemo } from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import debounce from "lodash/debounce";
import { usePageSearchParams } from "@/hooks/usePageSearchParams";

interface SearchInputProps extends Omit<InputProps, "onChange" | "value"> {
  paramKey?: string;
  delay?: number;
}

export function Search({
  paramKey = "s",
  delay = 500,
  placeholder = "Cari menu...",
  ...props
}: SearchInputProps) {
  const searchParams = usePageSearchParams({ [paramKey]: "" });

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        searchParams.update({ [paramKey]: value });
      }, delay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramKey, delay],
  );

  return (
    <Input.Search
      allowClear
      placeholder={placeholder}
      defaultValue={searchParams.get(paramKey) ?? ""}
      onChange={(e) => debouncedUpdate(e.target.value)}
      {...props}
    />
  );
}
