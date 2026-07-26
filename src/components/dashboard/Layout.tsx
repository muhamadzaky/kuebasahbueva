"use client";

import useSidebarStore from "@/store/useSidebarStore";
import Header from "./Header";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";
import { cn } from "@/utils/cn";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed, toggleSidebar } = useSidebarStore((state) => state);

  return (
    <>
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 min-h-dvh w-full md:w-[calc(100%-260px)]",
          isCollapsed ? "ml-17" : "ml-65",
        )}
      >
        <Header />
        <main className="flex flex-1 flex-col overflow-auto p-4 pt-2 md:pt-4">
          <PageHeader />
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
