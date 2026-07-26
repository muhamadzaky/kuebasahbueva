"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { uploadImage, deleteImage } from "@/utils/uploadImage";

export interface Menu {
  id: number;
  name: string;
  price: number;
  image_path: string | null;
}

export const MENU_PAGE_SIZE = 12;

interface UseMenusParams {
  page?: number;
  pageSize?: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export function useMenus({ page = 1, pageSize = 10 }: UseMenusParams = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["menus", page, pageSize],
    queryFn: async (): Promise<PaginatedResult<Menu>> => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from("menus")
        .select("*", { count: "exact" })
        .order("id", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const total = count ?? 0;

      return {
        data: data as Menu[],
        total,
        hasMore: from + (data?.length ?? 0) < total,
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Dipakai buat infinite scroll di sisi customer (client-side fetch page 2+)
export async function getMenusClient(
  searchQuery?: string,
  filter?: string,
  page = 1,
  pageSize = MENU_PAGE_SIZE,
): Promise<PaginatedResult<Menu>> {
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("menus")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("id", { ascending: true })
    .range(from, to);

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }
  if (filter) {
    query = query.eq("category", filter);
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

interface MenuPayload {
  name: string;
  price: number;
  is_active: boolean;
  imageFile?: File;
}

export function useCreateMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MenuPayload) => {
      let imagePath: string | null = null;

      if (payload.imageFile) {
        imagePath = await uploadImage(payload.imageFile, "menus");
      }

      const { data, error } = await supabase
        .from("menus")
        .insert({
          name: payload.name,
          price: payload.price,
          image_path: imagePath,
          is_active: payload.is_active,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useUpdateMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      currentImagePath,
      ...payload
    }: MenuPayload & { id: number; currentImagePath?: string | null }) => {
      let imagePath = currentImagePath ?? null;

      if (payload.imageFile) {
        if (currentImagePath) {
          await deleteImage(currentImagePath).catch(() => {});
        }
        imagePath = await uploadImage(payload.imageFile, "menus");
      }

      const { data, error } = await supabase
        .from("menus")
        .update({
          name: payload.name,
          price: payload.price,
          image_path: imagePath,
          is_active: payload.is_active,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useDeleteMenu() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menu: Menu) => {
      if (menu.image_path) {
        await deleteImage(menu.image_path).catch(() => {});
      }
      const { error } = await supabase.from("menus").delete().eq("id", menu.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useMenuCount() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["menus", "count"],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("menus")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });
}
