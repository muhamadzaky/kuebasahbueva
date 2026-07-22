import { create as zustandCreate, StateCreator } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, PersistOptions } from "zustand/middleware";

// Kita bikin tipe data tambahan untuk opsi konfigurasi store-nya, Bub
interface CreateStoreOptions<T> {
  persistOptions?: PersistOptions<T>;
}

export const createStoreWithShallow = <T extends object>(
  initializer: StateCreator<T, [["zustand/persist", unknown]] | []>,
  options?: CreateStoreOptions<T>,
) => {
  // Kalau user ngasih opsi persist, kita wrap initializer-nya pake middleware persist
  const storeConfig = options?.persistOptions
    ? persist(
        initializer as StateCreator<T, [["zustand/persist", unknown]]>,
        options.persistOptions,
      )
    : initializer;

  const useBaseStore = zustandCreate<T>(storeConfig as StateCreator<T>);

  // Kembalikan hook yang udah otomatis dibungkus useShallow
  return <U>(selector: (state: T) => U) => useBaseStore(useShallow(selector));
};
