import { createStoreWithShallow } from "@/utils/zustand";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type MenuStore = {
  cart: CartItem[];
  packageCart: CartItem[];
  openCart: boolean;
  setOpenCart: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  addPackageToCart: (item: CartItem) => void;
  removePackageFromCart: (id: number) => void;
  updatePackageQuantity: (id: number, quantity: number) => void;
  clearPackageCart: () => void;
};

const useMenuStore = createStoreWithShallow<MenuStore>((set) => ({
  cart: [],
  packageCart: [],
  openCart: false,
  setOpenCart: (open) => set({ openCart: open }),

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((i) => i.id !== id) };
      }
      return {
        cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }),
  clearCart: () => set({ cart: [] }),

  addPackageToCart: (item) =>
    set((state) => {
      const existingItem = state.packageCart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          packageCart: state.packageCart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { packageCart: [...state.packageCart, item] };
    }),
  removePackageFromCart: (id) =>
    set((state) => ({
      packageCart: state.packageCart.filter((i) => i.id !== id),
    })),
  updatePackageQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { packageCart: state.packageCart.filter((i) => i.id !== id) };
      }
      return {
        packageCart: state.packageCart.map((i) =>
          i.id === id ? { ...i, quantity } : i,
        ),
      };
    }),
  clearPackageCart: () => set({ packageCart: [] }),
}));

export default useMenuStore;
