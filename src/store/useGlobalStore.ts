import type { BreadcrumbProps } from "antd";
import { createStoreWithShallow } from "@/utils/zustand";

interface GlobalState {
  title: string;
  description: string;
  breadcrumbItem: BreadcrumbProps["items"];
  loading: boolean;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setBreadcrumbItem: (items: BreadcrumbProps["items"]) => void;
  setLoading: (loading: boolean) => void;
  init: () => void;
}

const initialState = {
  title: "",
  description: "",
  breadcrumbItem: [] as BreadcrumbProps["items"],
  loading: false,
};

const useGlobalStore = createStoreWithShallow<GlobalState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setBreadcrumbItem: (breadcrumbItem) => set({ breadcrumbItem }),
  setLoading: (loading) => set({ loading }),
  init: () => set({ ...initialState }),
}));

export default useGlobalStore;
