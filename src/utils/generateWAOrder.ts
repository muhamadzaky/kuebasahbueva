// utils/generateWhatsAppOrder.ts

interface OrderItemLine {
  name: string;
  quantity: number;
}

interface GenerateOrderMessageParams {
  items: OrderItemLine[];
  packagingItems?: OrderItemLine[];
  customerName?: string;
}

export function generateOrderMessage({
  items,
  packagingItems = [],
  customerName,
}: GenerateOrderMessageParams): string {
  const itemLines = items
    .map((item) => `${item.quantity} x ${item.name}`)
    .join("\n");

  const packagingLines =
    packagingItems.length > 0
      ? "\n" +
        packagingItems
          .map((item) => `${item.quantity} x ${item.name}`)
          .join("\n")
      : "";

  const greeting = customerName
    ? `Halo, saya ${customerName} mau pesan:`
    : "Halo, saya mau pesan:";

  return [greeting, "", itemLines + packagingLines, "", "Terima kasih"].join(
    "\n",
  );
}

const STORE_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WA_NO;

if (!STORE_WHATSAPP_NUMBER) {
  console.warn("NEXT_PUBLIC_WA_NO belum di-set di environment variable");
}

export function buildWhatsAppLink(message: string): string {
  if (!STORE_WHATSAPP_NUMBER) {
    throw new Error("Nomor WhatsApp toko belum dikonfigurasi");
  }

  const normalizedPhone = STORE_WHATSAPP_NUMBER.replace(/[^0-9]/g, "").replace(
    /^0/,
    "62",
  );

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
