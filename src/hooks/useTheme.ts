"use client";

import { useEffect } from "react";
import useThemeStore, { type Theme } from "@/store/useThemeStore";

export { type Theme };

export function useTheme() {
  const { theme, setTheme } = useThemeStore((state) => state);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
}
