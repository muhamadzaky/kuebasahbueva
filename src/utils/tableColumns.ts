import type { TableProps } from "antd";

interface NumberColumnOptions {
  currentPage?: number;
  pageSize?: number;
  title?: string;
  width?: number;
}

export function getNumberColumn(
  options: NumberColumnOptions = {},
): NonNullable<TableProps["columns"]>[number] {
  const { currentPage = 1, pageSize = 10, title = "No", width = 60 } = options;

  return {
    title,
    key: "__row_number__",
    width,
    render: (_value, _record, index) =>
      (currentPage - 1) * pageSize + index + 1,
  };
}
