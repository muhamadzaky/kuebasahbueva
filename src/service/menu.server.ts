import { createClient } from "@/utils/supabase/server";
import { type Menu } from "./menu.service";
import { MENU_PAGE_SIZE } from "@/app/(customer)/menus/constants";

interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

// NOTE: Used on Server Component (first initial load, SSR)
export async function getMenus(
  searchQuery?: string,
  filter?: string,
  page = 1,
  pageSize = MENU_PAGE_SIZE,
): Promise<PaginatedResult<Menu>> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("menus")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .range(from, to);

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  if (filter === "name-asc") {
    query = query.order("name", { ascending: true });
  } else if (filter === "name-desc") {
    query = query.order("name", { ascending: false });
  } else if (filter === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (filter === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("id", { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const total = count ?? 0;

  return {
    data: data as Menu[],
    total,
    hasMore: from + (data?.length ?? 0) < total,
  };
}
