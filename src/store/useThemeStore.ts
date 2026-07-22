import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

type ThemeStore = {
  theme: Theme;
  hydrated: boolean;
  setTheme: (theme: Theme) => void;
  setHydrated: (hydrated: boolean) => void;
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      hydrated: false,

      setTheme: (theme) => set({ theme }),

      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "theme-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export default useThemeStore;
