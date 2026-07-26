"use client";

import { createClient } from "@/utils/supabase/client";

type ImageCategory = "menus" | "packages";

export async function uploadImage(
  file: File,
  category: ImageCategory,
): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${category}/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return filePath;
}

export async function deleteImage(imagePath: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from("images").remove([imagePath]);
  if (error) throw error;
}

export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  const supabase = createClient();
  const { data } = supabase.storage.from("images").getPublicUrl(imagePath);
  return data.publicUrl;
}

// --- Khusus avatar (bucket private) ---

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return filePath;
}

export async function deleteAvatar(avatarPath: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from("avatars").remove([avatarPath]);
  if (error) throw error;
}

export async function getAvatarUrl(
  avatarPath: string | null,
): Promise<string | null> {
  if (!avatarPath) return null;

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(avatarPath, 60 * 60);

  if (error) return null;
  return data.signedUrl;
}
