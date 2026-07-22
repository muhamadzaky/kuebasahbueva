import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageHeader from "@/components/dashboard/PageHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-dvh w-full md:w-[calc(100%-260px)]">
        <Header />
        <main className="flex flex-1 flex-col overflow-auto p-4 pt-2 md:pt-4">
          <PageHeader />
          {children}
        </main>
      </div>
    </>
  );
}
