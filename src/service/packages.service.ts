"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { uploadImage, deleteImage } from "@/utils/uploadImage";

export interface Package {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  order: number;
  image_path: string | null;
}

interface UsePackagesParams {
  page?: number;
  pageSize?: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export function usePackages({
  page = 1,
  pageSize = 10,
}: UsePackagesParams = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["packages", page, pageSize],
    queryFn: async (): Promise<PaginatedResult<Package>> => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from("packages")
        .select("*", { count: "exact" })
        .order("order", { ascending: true })
        .range(from, to);

      if (error) throw error;

      return {
        data: data as Package[],
        total: count ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Dipakai di customer side (CartDrawer) - ambil semua package aktif sekaligus
export function useAllPackages() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["packages", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select()
        .eq("is_active", true)
        .order("order", { ascending: true });
      if (error) throw error;
      return data as Package[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

interface PackagePayload {
  name: string;
  price: number;
  is_active?: boolean;
  order?: number;
  imageFile?: File;
}

export function useCreatePackage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PackagePayload) => {
      let imagePath: string | null = null;

      if (payload.imageFile) {
        imagePath = await uploadImage(payload.imageFile, "packages");
      }

      const { data, error } = await supabase
        .from("packages")
        .insert({
          name: payload.name,
          price: payload.price,
          is_active: payload.is_active,
          order: payload.order,
          image_path: imagePath,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}

export function useUpdatePackage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      currentImagePath,
      originalImagePath,
      ...payload
    }: PackagePayload & {
      id: number;
      currentImagePath?: string | null;
      originalImagePath?: string | null;
    }) => {
      let imagePath = currentImagePath ?? null;

      // Hapus gambar lama dari Storage kalau memang ada perubahan
      // (ganti gambar baru, atau dihapus tanpa gambar pengganti)
      if (originalImagePath && originalImagePath !== currentImagePath) {
        await deleteImage(originalImagePath).catch(() => {});
      }

      if (payload.imageFile) {
        imagePath = await uploadImage(payload.imageFile, "packages");
      }

      const { data, error } = await supabase
        .from("packages")
        .update({
          name: payload.name,
          price: payload.price,
          is_active: payload.is_active,
          order: payload.order,
          image_path: imagePath,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}

export function useDeletePackage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: Package) => {
      if (pkg.image_path) {
        await deleteImage(pkg.image_path).catch(() => {});
      }
      const { error } = await supabase
        .from("packages")
        .delete()
        .eq("id", pkg.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}

export function usePackageCount() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["packages", "count"],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("packages")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });
}
