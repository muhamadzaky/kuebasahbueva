"use client";

import {
  RiCloseLargeLine,
  RiContractRightLine,
  RiMenuLine,
} from "@remixicon/react";
import { useMemo } from "react";
import useSidebarStore from "@/store/useSidebarStore";
import { cn } from "@/utils/cn";
import { colorTheme } from "@/themes/colors";
import useGlobalStore from "@/store/useGlobalStore";
import AppAvatar from "./Avatar";
import { Button } from "antd";

export default function Header() {
  const { title } = useGlobalStore((state) => state);
  const { isCollapsed, toggleSidebar } = useSidebarStore((state) => state);

  const MobileIcon = useMemo(
    () => (isCollapsed ? RiMenuLine : RiCloseLargeLine),
    [isCollapsed],
  );

  return (
    <header
      className={cn(
        "fixed right-0 top-0 flex h-16 min-h-16 items-center bg-primary-white dark:bg-primary-black px-4 py-3 transition-all duration-300 ease-in-out",
        !isCollapsed ? "md:left-65" : "md:left-17",
      )}
    >
      <div className="hidden flex-1 items-center justify-between gap-6 md:flex">
        {isCollapsed && (
          <Button
            type="text"
            icon={<RiContractRightLine size={18} />}
            onClick={() => toggleSidebar(!isCollapsed)}
          />
        )}
        <div className="ml-auto">
          <AppAvatar />
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-6 md:hidden">
        <div className="flex items-center gap-3">
          <MobileIcon
            size={18}
            onClick={() => toggleSidebar(!isCollapsed)}
            className="cursor-pointer"
          />
          {title && (
            <span className="text-xl font-semibold text-[#1B1B1B]">
              {title}
            </span>
          )}
        </div>
        <AppAvatar onlyImage />
      </div>
    </header>
  );
}
