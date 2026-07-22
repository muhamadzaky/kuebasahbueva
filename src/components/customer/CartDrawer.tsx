"use client";

import { useState } from "react";
import useMenuStore from "@/app/(customer)/menus/store";
import { Button, Drawer, Divider, Modal, App } from "antd";
import MenuCard from "./MenuCard";
import PackageCard from "./PackageCard";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import useCountTotalCartItems from "@/hooks/useCountTotalCartItems";
import useCountTotalCartPrice from "@/hooks/useCountTotalCartPrice";
import useCountTotalPackageItems from "@/hooks/useCountTotalPackageItems";
import useCountTotalPackagePrice from "@/hooks/useCountTotalPackagePrice";
import ItemField from "../ItemField";
import {
  RiArrowUpSLine,
  RiDeleteBin6Line,
  RiPrinterLine,
} from "@remixicon/react";
import { generateReceiptPdf } from "@/utils/printInvoice";
import { usePackages } from "@/service/packages.service";

const CartDrawer = () => {
  const path = usePathname();
  const router = useRouter();
  const { modal } = App.useApp();

  const [packagingOpen, setPackagingOpen] = useState(false);

  const totalMenuItems = useCountTotalCartItems();
  const totalMenuPrice = useCountTotalCartPrice();

  const totalPackageItems = useCountTotalPackageItems();
  const totalPackagePrice = useCountTotalPackagePrice();

  const grandTotalItems = totalMenuItems + totalPackageItems;
  const grandTotalPrice = totalMenuPrice + totalPackagePrice;

  const packages = usePackages();

  const {
    cart,
    packageCart,
    setOpenCart,
    openCart,
    clearCart,
    clearPackageCart,
  } = useMenuStore((state) => ({
    cart: state.cart,
    packageCart: state.packageCart,
    openCart: state.openCart,
    setOpenCart: state.setOpenCart,
    clearCart: state.clearCart,
    clearPackageCart: state.clearPackageCart,
  }));

  const isPackagingEmpty = packageCart.length === 0;
  const isPrintDisabled = grandTotalItems <= 0 || isPackagingEmpty;

  const handleClearAll = () => {
    clearCart();
    clearPackageCart();
  };

  const openClearConfirm = () => {
    modal.confirm({
      title: "Kosongkan keranjang?",
      content: "Semua item di keranjang akan dihapus.",
      centered: true,
      okText: "Ya, kosongkan",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: handleClearAll,
    });
  };

  const handlePrintInvoice = async () => {
    const combinedItems = [...cart, ...packageCart];

    try {
      await generateReceiptPdf(combinedItems);
      handleClearAll();
      setOpenCart(false);
    } catch (error) {
      console.error("Gagal generate invoice:", error);
    }
  };

  const openPrintConfirm = () => {
    if (isPrintDisabled) return;

    modal.confirm({
      title: "Sudah selesai belanja?",
      content: "Kalau invoice diprint, keranjang bakal kosong lagi ya!",
      centered: true,
      okText: "Ya, print invoice",
      cancelText: "Batal",
      onOk: handlePrintInvoice,
    });
  };

  return (
    <Drawer
      title="Keranjang"
      closable={{ "aria-label": "Close Button" }}
      onClose={() => {
        setOpenCart(false);
        setPackagingOpen(false);
      }}
      open={openCart}
      classNames={{
        body: cn(grandTotalItems <= 0 && "flex items-center justify-center"),
      }}
      extra={
        grandTotalItems > 0 && (
          <Button
            type="text"
            danger
            icon={<RiDeleteBin6Line size={18} />}
            size="small"
            onClick={openClearConfirm}
          />
        )
      }
      footer={
        <>
          {packages.data && packages.data.length > 0 && (
            <div className="mb-3">
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  packagingOpen
                    ? "max-h-[600px] opacity-100 mb-2"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="flex flex-col gap-2">
                  {packages.data.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} origin="cart-drawer" />
                  ))}
                </div>
              </div>

              <div
                onClick={() => setPackagingOpen((prev) => !prev)}
                className="flex items-center justify-between w-full py-1 cursor-pointer"
              >
                <span
                  className={cn(
                    "font-semibold text-base transition-colors",
                    isPackagingEmpty
                      ? "text-primary-red animate-shake"
                      : "text-primary-black dark:text-primary-white",
                  )}
                >
                  {`Pilih Packaging${isPackagingEmpty ? " Dulu!" : ""}`}
                </span>
                <RiArrowUpSLine
                  className={cn(
                    "transition-transform duration-300",
                    packagingOpen ? "rotate-180" : "rotate-0",
                  )}
                />
              </div>
            </div>
          )}

          <Divider className="my-2!" />

          <ItemField
            label="Total Makanan"
            labelClassName="text-base font-normal"
            value={`${totalMenuItems} buah`}
            valueClassName="text-sm font-medium"
            justify="between"
            className="mb-1"
          />

          <ItemField
            label="Total Packaging"
            labelClassName="text-base font-normal"
            value={`${totalPackageItems} buah`}
            valueClassName="text-sm font-medium"
            justify="between"
            className="mb-1"
          />

          <ItemField
            label="Total Item"
            labelClassName="text-base font-normal"
            value={`${grandTotalItems} buah`}
            valueClassName="text-lg font-bold"
            justify="between"
          />

          <Divider size="small" />

          <ItemField
            label="Total Dibayar"
            labelClassName="text-base font-normal"
            value={`Rp ${grandTotalPrice.toLocaleString("id-ID")}`}
            valueClassName="text-lg font-bold"
            justify="between"
          />

          <Button
            type="primary"
            block
            className="mt-4!"
            size="large"
            icon={<RiPrinterLine size={18} />}
            disabled={isPrintDisabled}
            onClick={openPrintConfirm}
          >
            Cetak Invoice
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {totalMenuItems > 0 &&
          cart.map((item) => (
            <MenuCard key={item.id} menu={item} origin="cart-drawer" />
          ))}

        {totalPackageItems > 0 &&
          packageCart.map((item) => (
            <PackageCard key={item.id} pkg={item} origin="cart-drawer" />
          ))}

        {totalMenuItems === 0 && (
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
