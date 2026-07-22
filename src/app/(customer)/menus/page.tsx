"use server";

import { Search } from "@/components/Search";
import { FilterMenu } from "@/components/customer/FilterMenu";
import { getMenus } from "@/service/menu.service";
import List from "./partials/List";

export default async function Menus({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; filter?: string }>;
}) {
  const { s, filter } = await searchParams;
  const menus = await getMenus(s, filter);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-bold text-4xl">Menu</h1>
      <h3 className="text-xl font-mono">Lihat menu yang kamu mau!</h3>

      <div className="flex flex-col md:flex-row gap-3">
        <Search
          paramKey="s"
          placeholder="Atau cari menu di sini..."
          size="large"
        />
        <FilterMenu />
      </div>

      <List menus={menus} />
    </div>
  );
}
