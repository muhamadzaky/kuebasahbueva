"use client";

import {
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
  RiArrowDownSLine,
  RiShoppingCart2Line,
  RiShoppingCart2Fill,
} from "@remixicon/react";
import { cn } from "@/utils/cn";
import { Badge, Button, Dropdown } from "antd";
import { useTheme } from "@/hooks/useTheme";
import useMenuStore from "@/app/(customer)/menus/store";
import { useShallow } from "zustand/shallow";
import CartDrawer from "./CartDrawer";
import useCountTotalCartItems from "@/hooks/useCountTotalCartItems";
import Image from "next/image";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { cart, openCart, setOpenCart } = useMenuStore(
    useShallow((state) => ({
      cart: state.cart,
      openCart: state.openCart,
      setOpenCart: state.setOpenCart,
    })),
  );

  const getCurrentIcon = () => {
    if (theme === "dark") return <RiMoonLine size={20} />;
    if (theme === "light") return <RiSunLine size={20} />;
    return <RiComputerLine size={20} />;
  };

  const items = [
    {
      key: "light",
      label: "Light Mode",
      icon: <RiSunLine size={16} />,
      onClick: () => setTheme("light"),
    },
    {
      key: "dark",
      label: "Dark Mode",
      icon: <RiMoonLine size={16} />,
      onClick: () => setTheme("dark"),
    },
    {
      key: "system",
      label: "System",
      icon: <RiComputerLine size={16} />,
      onClick: () => setTheme("system"),
    },
  ];

  const hasCart = Boolean(cart.length);
  const totalItems = useCountTotalCartItems();

  console.log({ hasCart, totalItems });

  return (
    <header className="relative z-10 h-16 min-h-16">
      <div
        className={cn(
          "fixed inset-x-0 top-0 flex h-16 min-h-16 w-full items-center justify-between bg-primary-white py-3 transition-all duration-300 ease-in-out bg-primary-white dark:bg-primary-black",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex-1 items-center gap-6 flex">
            <Image
              src="/logo.png"
              alt="Kue Basah Bu Eva"
              width={40}
              height={40}
            />
          </div>
          <div className="flex items-center gap-4 [&_.ant-badge-count]:transform-none!">
            {hasCart ? (
              <Badge count={totalItems} size="small">
                <Button
                  icon={<RiShoppingCart2Fill size={20} />}
                  onClick={() => setOpenCart(!openCart)}
                  variant="text"
                  color="default"
                />
              </Badge>
            ) : (
              <Button
                icon={<RiShoppingCart2Line size={20} />}
                onClick={() => setOpenCart(!openCart)}
                variant="text"
                color="default"
              />
            )}

            <Dropdown
              menu={{ items, selectedKeys: [theme] }}
              trigger={["click"]}
            >
              <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {getCurrentIcon()}
                <RiArrowDownSLine size={16} />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}
