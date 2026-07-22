import type { Metadata } from "next";
import Header from "@/components/customer/Header";

export const metadata: Metadata = {
  title: "Kue Basah Bu Eva",
  manifest: "/manifest.json",
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  );
}
