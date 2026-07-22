import { createStoreWithShallow } from "@/utils/zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: (status: boolean) => void;
}

const useSidebarStore = createStoreWithShallow<SidebarState>((set) => ({
  isCollapsed: false,
  toggleSidebar: (status) => set({ isCollapsed: status }),
}));

export default useSidebarStore;
