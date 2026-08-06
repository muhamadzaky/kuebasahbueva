import { Search } from "@/components/Search";
import { FilterMenu } from "@/components/customer/FilterMenu";
import { getMenus } from "@/service/menu.server";
import List from "./partials/List";
import FAB from "./components/FAB";

export default async function Menus({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; filter?: string }>;
}) {
  const { s, filter } = await searchParams;
  const initialResult = await getMenus(s, filter, 1);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-bold text-4xl">Menu</h1>
      <h3 className="text-xl font-mono">Lihat menu yang kamu mau!</h3>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Search
          paramKey="s"
          placeholder="Atau cari menu di sini..."
          size="large"
        />
        <FilterMenu />
      </div>

      <List
        key={`${s ?? ""}-${filter ?? ""}`}
        initialMenus={initialResult.data}
        initialHasMore={initialResult.hasMore}
        searchQuery={s}
        filter={filter}
      />

      <FAB />
    </div>
  );
}
