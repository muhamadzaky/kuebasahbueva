"use client";

import useMenuStore from "@/app/(customer)/menus/store";
import { colorTheme } from "@/themes/colors";
import { cn } from "@/utils/cn";
import { RiAddLine, RiArchive2Fill, RiSubtractLine } from "@remixicon/react";
import { Button, Card, InputNumber } from "antd";

interface PackageCardProps {
  pkg: {
    id: number;
    name: string;
    price: number;
  };
  origin?: string;
}

const PackageCard = ({ pkg, origin }: PackageCardProps) => {
  const { packageCart, addPackageToCart, updatePackageQuantity } = useMenuStore(
    (state) => state,
  );

  const cartItem = packageCart.find((item) => item.id === pkg.id);

  return (
    <Card>
      <div className="flex gap-3 items-start justify-between">
        <div className="flex flex-col">
          <div className="font-semibold text-lg">{pkg.name}</div>

          {pkg.price && (
            <div className="text-base text-gray-500 dark:text-gray-400 font-mono">
              Rp {pkg.price.toLocaleString()}
            </div>
          )}
        </div>

        <div className="relative">
          <div
            className={cn(
              "rounded bg-[#F5F5F5] flex items-center justify-center",
              origin === "cart-drawer" ? "size-16" : "size-24",
            )}
          >
            <RiArchive2Fill color={colorTheme.primaryBlack} />
          </div>

          {/* Action */}
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2">
            {!cartItem ? (
              <Button
                type="primary"
                shape="round"
                onClick={() =>
                  addPackageToCart({
                    ...pkg,
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
                  onClick={() =>
                    updatePackageQuantity(pkg.id, cartItem.quantity - 1)
                  }
                  classNames={{ icon: "h-inherit" }}
                />

                <InputNumber
                  controls={false}
                  value={cartItem.quantity}
                  className="w-12 text-center border-none! bg-transparent! [&_.ant-input-number-input]:text-primary-red! [&_.ant-input-number-input]:p-0! [&_.ant-input-number-input]:text-center! ring-0! p-0! w-[3rem]! font-semibold!"
                  onChange={(value) =>
                    updatePackageQuantity(pkg.id, Number(value) || 0)
                  }
                />

                <Button
                  size="small"
                  shape="circle"
                  variant="text"
                  color="primary"
                  icon={<RiAddLine />}
                  onClick={() =>
                    updatePackageQuantity(pkg.id, cartItem.quantity + 1)
                  }
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

export default PackageCard;
