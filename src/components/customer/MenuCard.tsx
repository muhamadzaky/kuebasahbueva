"use client";

import { useState } from "react";
import useMenuStore from "@/app/(customer)/menus/store";
import { colorTheme } from "@/themes/colors";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/uploadImage";
import { RiAddLine, RiRestaurantFill, RiSubtractLine } from "@remixicon/react";
import { Button, Card, InputNumber, Image as AntImage } from "antd";
import Image from "next/image";

const MenuCard = ({ menu, origin }: { menu: any; origin?: string }) => {
  const { cart, addToCart, updateQuantity } = useMenuStore((state) => state);
  const [previewOpen, setPreviewOpen] = useState(false);

  const cartItem = cart.find((item) => item.id === menu.id);
  const url = getImageUrl(menu.image_path);

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

        <div
          className={cn(
            "relative rounded",
            origin === "cart-drawer" ? "size-16" : "size-24",
          )}
        >
          {url ? (
            <>
              <div
                role="button"
                onClick={() => setPreviewOpen(true)}
                className="absolute inset-0 cursor-pointer"
              >
                <Image
                  src={url}
                  alt={menu.name}
                  fill
                  sizes="96px"
                  className="object-cover rounded"
                  unoptimized={url.includes("supabase.co")}
                />
              </div>

              <AntImage
                src={url}
                alt={menu.name}
                style={{ display: "none" }}
                preview={{
                  open: previewOpen,
                  onOpenChange: (visible) => setPreviewOpen(visible),
                }}
              />
            </>
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
