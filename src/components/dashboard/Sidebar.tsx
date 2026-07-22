"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { RiContractLeftLine } from "@remixicon/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import useSidebarStore from "@/store/useSidebarStore";
import { cn } from "@/utils/cn";
import { colorTheme } from "@/themes/colors";
import { menus } from "@/constants/menus";

export default function Sidebar() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint.lt("md");
  const { isCollapsed, toggleSidebar } = useSidebarStore((state) => state);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative z-10 transition-all duration-300 ease-in-out md:block",
        !isCollapsed
          ? "w-full md:w-65 md:min-w-65"
          : "hidden md:w-17 md:min-w-17",
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 flex flex-col items-center gap-3 bg-primary-white px-3 py-4 transition-all duration-300 ease-in-out",
          !isCollapsed
            ? "left-0 w-full md:w-65 md:min-w-65"
            : "-left-full md:left-0 md:w-17 md:min-w-17",
        )}
      >
        <div className="flex items-center justify-between px-2 w-full pt-3.5 pb-2">
          <Link href="/dashboard" draggable={false}>
            <Image
              src="https://placehold.co/128x40/1476D9/FFFFFF?text=KBBE"
              alt="Kue Basah Bu Eva"
              width={isCollapsed ? 32 : 128}
              height={40}
              className="transition-all ease-in-out duration-300"
            />
          </Link>

          {!isCollapsed && (
            <RiContractLeftLine
              size={18}
              color={colorTheme.primaryBlack}
              onClick={() => toggleSidebar(!isCollapsed)}
              className="cursor-pointer"
            />
          )}
        </div>

        <ul
          className={cn(
            "flex flex-col gap-1 max-h-[calc(100dvh-4rem)] overflow-auto w-full",
            isMobile && "py-2",
          )}
        >
          {menus.map((group, gi) => (
            <Fragment key={`group-${gi}`}>
              {!isCollapsed && (
                <li className="px-2 pb-1 text-sm font-bold text-[#797979] list-none">
                  {group.category}
                </li>
              )}
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icons;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    draggable={false}
                    onClick={() => isMobile && toggleSidebar(true)}
                  >
                    <li
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300",
                        isActive
                          ? "!text-[#1B1B1B] bg-[#F9F9F9] font-medium"
                          : "text-[#797979] hover:bg-[#F9F9F9]",
                      )}
                    >
                      <Icon size={isCollapsed ? 20 : 18} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </li>
                  </Link>
                );
              })}
            </Fragment>
          ))}
        </ul>
      </div>
    </aside>
  );
}
