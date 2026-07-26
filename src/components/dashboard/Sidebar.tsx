"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiContractLeftLine, RiContractRightLine } from "@remixicon/react";

import { menus } from "@/constants/menus";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import useSidebarStore from "@/store/useSidebarStore";
import { colorTheme } from "@/themes/colors";
import { cn } from "@/utils/cn";
import { Button } from "antd";

export default function Sidebar() {
  const pathname = usePathname();

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint.lt("md");

  const { isCollapsed, toggleSidebar } = useSidebarStore((state) => state);

  const asideClass = cn(
    "relative z-10 transition-all duration-300 ease-in-out md:block",
    isCollapsed ? "hidden md:w-17 md:min-w-17" : "w-full md:w-65 md:min-w-65",
  );

  const sidebarClass = cn(
    "fixed inset-y-0 flex flex-col gap-3 bg-primary-white px-3 py-4 transition-all duration-300 ease-in-out dark:bg-primary-black",
    isCollapsed
      ? "-left-full md:left-0 md:w-17 md:min-w-17"
      : "left-0 w-full md:w-65 md:min-w-65",
  );

  const menuItemClass =
    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-300";

  const activeMenuClass =
    "bg-[#F9F9F9] text-[#1B1B1B] font-medium dark:bg-[#2B2B2B] dark:text-white dark:hover:bg-[#3B3B3B]";

  const inactiveMenuClass =
    "text-[#797979] hover:bg-[#F9F9F9] dark:text-white dark:hover:bg-[#2B2B2B]";

  return (
    <aside className={asideClass}>
      <div className={sidebarClass}>
        <div className="flex w-full items-center justify-between">
          <Link href="/dashboard" draggable={false}>
            <Image
              src="/logo.png"
              alt="Kue Basah Bu Eva"
              width={32}
              height={40}
              className="transition-all duration-300"
            />
          </Link>

          {!isCollapsed && (
            <Button
              type="text"
              icon={<RiContractLeftLine size={18} />}
              onClick={() => toggleSidebar(true)}
            />
          )}
        </div>

        <ul
          className={cn(
            "flex max-h-[calc(100dvh-4rem)] w-full flex-col gap-1 overflow-auto",
            isMobile ? "py-2" : "pt-4 pb-2",
          )}
        >
          {menus.map((group) => (
            <Fragment key={group.category}>
              {!isCollapsed && (
                <li className="list-none px-2 pb-1 text-sm font-bold text-[#797979]">
                  {group.category}
                </li>
              )}

              {group.items.map((item) => {
                const Icon = item.icons;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    draggable={false}
                    onClick={() => isMobile && toggleSidebar(true)}
                  >
                    <li
                      className={cn(
                        menuItemClass,
                        isActive ? activeMenuClass : inactiveMenuClass,
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
