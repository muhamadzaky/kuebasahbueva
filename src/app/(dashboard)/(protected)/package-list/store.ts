import { createStoreWithShallow } from "@/utils/zustand";
import type { UploadFile } from "antd";
import type { Package } from "@/service/packages.service";

interface PackageModalStore {
  modalOpen: boolean;
  editingPackage: Package | null;
  fileList: UploadFile[];
  removeExistingImage: boolean;
  openCreateModal: () => void;
  openEditModal: (pkg: Package) => void;
  closeModal: () => void;
  setFileList: (fileList: UploadFile[]) => void;
  setRemoveExistingImage: (value: boolean) => void;
}

const usePackageModalStore = createStoreWithShallow<PackageModalStore>(
  (set) => ({
    modalOpen: false,
    editingPackage: null,
    fileList: [],
    removeExistingImage: false,

    openCreateModal: () =>
      set({
        modalOpen: true,
        editingPackage: null,
        fileList: [],
        removeExistingImage: false,
      }),

    openEditModal: (pkg) =>
      set({
        modalOpen: true,
        editingPackage: pkg,
        fileList: [],
        removeExistingImage: false,
      }),

    closeModal: () =>
      set({
        modalOpen: false,
        editingPackage: null,
        fileList: [],
        removeExistingImage: false,
      }),

    setFileList: (fileList) => set({ fileList }),
    setRemoveExistingImage: (value) => set({ removeExistingImage: value }),
  }),
);

export default usePackageModalStore;
