"use client";

import { createClient } from "@/utils/supabase/client";

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
