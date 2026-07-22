"use client";

import { Breadcrumb } from "antd";
import useGlobalStore from "@/store/useGlobalStore";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export default function PageHeader() {
  const { title, description, breadcrumbItem } = useGlobalStore(
    (state) => state,
  );
  const breakpoint = useBreakpoint();

  const hasContent = Boolean(title || description);
  const hasBreadcrumb =
    Array.isArray(breadcrumbItem) && breadcrumbItem.length > 0;

  if ((!hasContent && !hasBreadcrumb) || breakpoint.lt("md")) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-4">
      <div className="flex flex-col items-start">
        {title && (
          <span className="text-xl font-semibold text-[#1B1B1B]">{title}</span>
        )}
        {description && (
          <span className="text-sm font-medium text-[#949494]">
            {description}
          </span>
        )}
      </div>
      {hasBreadcrumb && <Breadcrumb items={breadcrumbItem} />}
    </div>
  );
}
