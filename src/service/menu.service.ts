import { createClient } from "@/utils/supabase/server";

export async function getMenus(keyword?: string, filter?: string) {
  const supabase = await createClient();

  let query = supabase.from("menus").select();

  if (keyword) {
    query = query.ilike("name", `%${keyword}%`);
  }

  switch (filter) {
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;

    case "name-desc":
      query = query.order("name", { ascending: false });
      break;

    case "price-asc":
      query = query.order("price", { ascending: true });
      break;

    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      break;
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
