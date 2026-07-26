import { createStoreWithShallow } from "@/utils/zustand";
import type { UploadFile } from "antd";
import type { Menu } from "@/service/menu.service";

interface MenuModalStore {
  modalOpen: boolean;
  editingMenu: Menu | null;
  fileList: UploadFile[];
  removeExistingImage: boolean;
  openCreateModal: () => void;
  openEditModal: (menu: Menu) => void;
  closeModal: () => void;
  setFileList: (fileList: UploadFile[]) => void;
  setRemoveExistingImage: (value: boolean) => void;
}

const useMenuModalStore = createStoreWithShallow<MenuModalStore>((set) => ({
  modalOpen: false,
  editingMenu: null,
  fileList: [],
  removeExistingImage: false,

  openCreateModal: () =>
    set({
      modalOpen: true,
      editingMenu: null,
      fileList: [],
      removeExistingImage: false,
    }),

  openEditModal: (menu) =>
    set({
      modalOpen: true,
      editingMenu: menu,
      fileList: [],
      removeExistingImage: false,
    }),

  closeModal: () =>
    set({
      modalOpen: false,
      editingMenu: null,
      fileList: [],
      removeExistingImage: false,
    }),

  setFileList: (fileList) => set({ fileList }),
  setRemoveExistingImage: (value) => set({ removeExistingImage: value }),
}));

export default useMenuModalStore;
