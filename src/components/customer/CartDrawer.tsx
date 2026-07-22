"use client";

import useMenuStore from "@/app/(customer)/menus/store";
import { Button, Drawer } from "antd";
import MenuCard from "./MenuCard";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import useCountTotalCartItems from "@/hooks/useCountTotalCartItems";

const CartDrawer = () => {
  const path = usePathname();
  const router = useRouter();

  const totalItems = useCountTotalCartItems();

  const { cart, setOpenCart, openCart } = useMenuStore((state) => ({
    cart: state.cart,
    openCart: state.openCart,
    setOpenCart: state.setOpenCart,
  }));

  return (
    <Drawer
      title="Keranjang"
      closable={{ "aria-label": "Close Button" }}
      onClose={() => setOpenCart(false)}
      open={openCart}
      classNames={{
        body: cn(totalItems <= 0 && "flex items-center justify-center"),
      }}
    >
      <div className="flex flex-col gap-2">
        {totalItems > 0 &&
          cart.map((item) => (
            <MenuCard key={item.id} menu={item} origin="cart-drawer" />
          ))}

        {totalItems === 0 && (
          <div className="flex flex-col gap-3 items-center justify-center">
            <p className="text-center font-semibold text-lg">
              Gak ada item di keranjang. <br /> Tambah itemnya dulu yuk!
            </p>

            <Button
              type="primary"
              onClick={() => {
                if (path === "/menus") {
                  setOpenCart(false);
                } else {
                  router.push("/menus");
                }
              }}
            >
              Kembali ke menu
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
