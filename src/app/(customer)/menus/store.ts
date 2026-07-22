import { createStoreWithShallow } from "@/utils/zustand";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type MenuStore = {
  cart: CartItem[];
  openCart: boolean;
  setOpenCart: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const useMenuStore = createStoreWithShallow<MenuStore>((set) => ({
  cart: [],
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
        return {
          cart: state.cart.filter((i) => i.id !== id),
        };
      }

      return {
        cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }),
  clearCart: () => set({ cart: [] }),
}));

export default useMenuStore;
