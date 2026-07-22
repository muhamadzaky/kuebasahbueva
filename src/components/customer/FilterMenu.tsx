"use client";

import { usePageSearchParams } from "@/hooks/usePageSearchParams";
import { Select, SelectProps } from "antd";

const filters: SelectProps["options"] = [
  {
    value: "name-asc",
    label: "Nama (A-Z)",
  },
  {
    value: "name-desc",
    label: "Nama (Z-A)",
  },
  {
    value: "price-asc",
    label: "Harga (Termurah)",
  },
  {
    value: "price-desc",
    label: "Harga (Termahal)",
  },
];

export function FilterMenu() {
  const searchParams = usePageSearchParams();

  return (
    <Select
      options={filters}
      className="min-w-48"
      value={searchParams.filter ?? undefined}
      onChange={(value) =>
        searchParams.update({
          filter: value || undefined,
        })
      }
      placeholder="Filter"
      allowClear
    />
  );
}
