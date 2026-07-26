"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { uploadAvatar, deleteAvatar, getAvatarUrl } from "@/utils/uploadImage";

export interface Profile {
  id: string;
  name: string | null;
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithExtras extends Profile {
  email: string | null;
  avatarUrl: string | null;
}

export function useProfile() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileWithExtras | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const avatarUrl = await getAvatarUrl(data.avatar_path);

      return { ...data, email: user.email ?? null, avatarUrl };
    },
    staleTime: 30 * 60 * 1000,
  });
}

interface UpdateProfilePayload {
  name?: string;
  imageFile?: File;
  currentAvatarPath?: string | null;
  originalAvatarPath?: string | null;
}

export function useUpdateProfile() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      currentAvatarPath,
      originalAvatarPath,
      imageFile,
      ...payload
    }: UpdateProfilePayload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      let avatarPath = currentAvatarPath ?? null;

      if (originalAvatarPath && originalAvatarPath !== currentAvatarPath) {
        await deleteAvatar(originalAvatarPath).catch(() => {});
      }

      if (imageFile) {
        avatarPath = await uploadAvatar(imageFile, user.id);
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: payload.name,
          avatar_path: avatarPath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
