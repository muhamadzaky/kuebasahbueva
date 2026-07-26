"use client";

import { useState } from "react";
import useMenuStore from "@/app/(customer)/menus/store";
import { App, Button, Drawer, Divider, Input, Alert } from "antd";
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
  RiWhatsappLine,
} from "@remixicon/react";
import { generateReceiptPdf } from "@/utils/printInvoice";
import {
  generateOrderMessage,
  buildWhatsAppLink,
} from "@/utils/generateWAOrder";
import { useAllPackages } from "@/service/packages.service";
import { useGatekeeper } from "@/hooks/useGateKeeper";

const CartDrawer = () => {
  const { modal } = App.useApp();
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useGatekeeper();

  const [packagingOpen, setPackagingOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const totalMenuItems = useCountTotalCartItems();
  const totalMenuPrice = useCountTotalCartPrice();

  const totalPackageItems = useCountTotalPackageItems();
  const totalPackagePrice = useCountTotalPackagePrice();

  const grandTotalItems = totalMenuItems + totalPackageItems;
  const grandTotalPrice = totalMenuPrice + totalPackagePrice;

  const packages = useAllPackages();

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
  const isCustomerNameEmpty = customerName.trim().length === 0;

  // Packaging & nama customer cuma wajib buat flow staff (print invoice)
  const isPrintDisabled =
    grandTotalItems <= 0 || isPackagingEmpty || isCustomerNameEmpty;

  // Flow customer (kirim WA): cuma butuh minimal 1 menu, packaging & nama opsional
  const isSendWhatsAppDisabled = totalMenuItems <= 0;

  const packagingLabelText = isPackagingEmpty
    ? isAuthenticated
      ? "Pilih Packaging Dulu!"
      : "Pilih Packaging (Opsional)"
    : "Pilih Packaging";

  const packagingLabelIsWarning = isAuthenticated && isPackagingEmpty;

  const handleClearAll = () => {
    clearCart();
    clearPackageCart();
    setCustomerName("");
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
    if (isPrintDisabled) return;

    const combinedItems = [...cart, ...packageCart];

    try {
      await generateReceiptPdf(combinedItems, {
        customerName: customerName.trim(),
        action: "download",
      });
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
      content: "Kalau invoice diprint, cart bakal kosong lagi ya!",
      centered: true,
      okText: "Ya, print invoice",
      cancelText: "Batal",
      onOk: handlePrintInvoice,
    });
  };

  const handleSendWhatsApp = () => {
    if (isSendWhatsAppDisabled) return;

    const message = generateOrderMessage({
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity })),
      packagingItems: packageCart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      customerName: customerName.trim() || undefined,
    });

    try {
      const link = buildWhatsAppLink(message);
      window.open(link, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      title="Keranjang"
      closable={{ "aria-label": "Close Button" }}
      onClose={() => setOpenCart(false)}
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
        grandTotalItems > 0 && (
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
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        origin="cart-drawer"
                      />
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
                      packagingLabelIsWarning
                        ? "text-primary-red animate-shake"
                        : "text-primary-black dark:text-primary-white",
                    )}
                  >
                    {packagingLabelText}
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

            <Divider size="small" />

            <ItemField
              label="Total Item"
              labelClassName="text-base font-normal"
              value={`${grandTotalItems} buah`}
              valueClassName="text-lg font-bold"
              justify="between"
            />

            <ItemField
              label="Total Dibayar"
              labelClassName="text-base font-normal"
              value={`Rp ${grandTotalPrice.toLocaleString("id-ID")}`}
              valueClassName="text-lg font-bold"
              justify="between"
            />

            <div className="mt-3">
              <Input
                placeholder={
                  isAuthenticated ? "Dipesan Oleh" : "Nama kamu (opsional)"
                }
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={cn(
                  isAuthenticated &&
                    isCustomerNameEmpty &&
                    "border-primary-red! animate-shake",
                )}
                size="large"
                maxLength={50}
              />
              {isAuthenticated && isCustomerNameEmpty && (
                <div className="text-primary-red text-sm mt-1">
                  Nama pelanggan harus diisi ya!
                </div>
              )}
            </div>

            {isAuthenticated && (
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
            )}

            {!isAuthenticated && (
              <>
                <Alert
                  className="mt-4! mb-1!"
                  type="warning"
                  showIcon
                  title="Harga belum fix ya!"
                  description="Total di atas cuma estimasi. Packaging & harga final bakal dikonfirmasi lagi lewat chat WhatsApp."
                />

                <Button
                  type="primary"
                  block
                  className="mt-3!"
                  size="large"
                  icon={<RiWhatsappLine size={18} />}
                  disabled={isSendWhatsAppDisabled}
                  onClick={handleSendWhatsApp}
                >
                  Kirim Pesanan ke WhatsApp
                </Button>
              </>
            )}
          </>
        )
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
