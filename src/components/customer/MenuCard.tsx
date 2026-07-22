"use client";

import useMenuStore from "@/app/(customer)/menus/store";
import { colorTheme } from "@/themes/colors";
import { cn } from "@/utils/cn";
import { RiAddLine, RiRestaurantFill, RiSubtractLine } from "@remixicon/react";
import { Button, Card, InputNumber } from "antd";
import Image from "next/image";

const MenuCard = ({ menu, origin }: { menu: any; origin?: string }) => {
  const { cart, addToCart, updateQuantity } = useMenuStore((state) => state);

  const cartItem = cart.find((item) => item.id === menu.id);

  return (
    <Card>
      <div className="flex gap-3 items-start justify-between">
        <div className="flex flex-col">
          <div className="font-semibold text-lg">{menu.name}</div>

          {menu.price && (
            <div className="text-base text-gray-500 dark:text-gray-400 font-mono">
              Rp {menu.price.toLocaleString()}
            </div>
          )}
        </div>

        <div className="relative">
          {menu.image ? (
            <Image
              src={menu.image}
              alt={menu.name}
              className={cn(
                "rounded object-cover",
                origin === "cart-drawer" ? "size-16" : "size-24",
              )}
            />
          ) : (
            <div
              className={cn(
                "rounded bg-[#F5F5F5] flex items-center justify-center",
                origin === "cart-drawer" ? "size-16" : "size-24",
              )}
            >
              <RiRestaurantFill color={colorTheme.primaryBlack} />
            </div>
          )}

          {/* Action */}
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2">
            {!cartItem ? (
              <Button
                type="primary"
                shape="round"
                onClick={() =>
                  addToCart({
                    ...menu,
                    quantity: 1,
                  })
                }
              >
                Tambah
              </Button>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-primary-white p-1 shadow-md border-2 border-primary-red">
                <Button
                  size="small"
                  shape="circle"
                  variant="text"
                  color="primary"
                  icon={<RiSubtractLine />}
                  onClick={() => updateQuantity(menu.id, cartItem.quantity - 1)}
                  classNames={{ icon: "h-inherit" }}
                />

                <InputNumber
                  controls={false}
                  value={cartItem.quantity}
                  className="w-12 text-center border-none! bg-transparent! [&_.ant-input-number-input]:text-primary-red! [&_.ant-input-number-input]:p-0! [&_.ant-input-number-input]:text-center! ring-0! p-0! w-[3rem]! font-semibold!"
                  onChange={(value) =>
                    updateQuantity(menu.id, Number(value) || 0)
                  }
                />

                <Button
                  size="small"
                  shape="circle"
                  variant="text"
                  color="primary"
                  icon={<RiAddLine />}
                  onClick={() => updateQuantity(menu.id, cartItem.quantity + 1)}
                  classNames={{ icon: "h-inherit" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MenuCard;
