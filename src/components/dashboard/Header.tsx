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

export default function Header() {
  const { title } = useGlobalStore((state) => state);
  const { isCollapsed, toggleSidebar } = useSidebarStore((state) => state);

  const MobileIcon = useMemo(
    () => (isCollapsed ? RiMenuLine : RiCloseLargeLine),
    [isCollapsed],
  );

  return (
    <header className="relative z-10 h-16 min-h-16">
      <div
        className={cn(
          "fixed inset-x-0 top-0 flex h-16 min-h-16 w-full items-center bg-[#F9F9F9] px-4 py-3 transition-all duration-300 ease-in-out",
          !isCollapsed ? "md:left-65" : "md:left-17",
        )}
      >
        <div className="hidden flex-1 items-center justify-between gap-6 md:flex">
          {isCollapsed && (
            <RiContractRightLine
              size={18}
              onClick={() => toggleSidebar(!isCollapsed)}
              color={colorTheme.primaryBlack}
              className="cursor-pointer"
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
              color={colorTheme.primaryBlack}
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
      </div>
    </header>
  );
}
