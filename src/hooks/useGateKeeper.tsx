"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface GatekeeperResult {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useGatekeeper(): GatekeeperResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthenticated, isLoading };
}
