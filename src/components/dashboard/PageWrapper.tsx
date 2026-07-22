"use client";

import { useEffect, type ReactNode } from "react";
import type { BreadcrumbProps } from "antd";
import useGlobalStore from "@/store/useGlobalStore";

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbItems?: BreadcrumbProps["items"];
}

export default function PageWrapper({
  children,
  title,
  description,
  breadcrumbItems,
}: PageWrapperProps) {
  const { setTitle, setDescription, setBreadcrumbItem, init } = useGlobalStore(
    (state) => state,
  );

  useEffect(() => {
    setTitle(title ?? "");
    setDescription(description ?? "");
    setBreadcrumbItem(breadcrumbItems ?? []);

    return () => init();
  }, [
    title,
    description,
    breadcrumbItems,
    setTitle,
    setDescription,
    setBreadcrumbItem,
    init,
  ]);

  return children;
}
