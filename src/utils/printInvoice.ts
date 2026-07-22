"use client";

import dayjs from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";

(pdfMake as any).vfs = (pdfFonts as any).vfs ?? (pdfFonts as any).pdfMake?.vfs;

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface GenerateReceiptOptions {
  storeName?: string;
  storeInfo?: string[];
  invoiceNo?: string;
  tableNo?: string;
  fileName?: string;
  action?: "open" | "download" | "print" | "blob";
  logoPath?: string;
}

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(date: Date): string {
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dashedLine(): Content {
  return {
    text: "- ".repeat(46),
    fontSize: 8,
    color: "#999999",
    margin: [0, 4, 0, 4],
  };
}

async function loadImageAsDataUrl(path: string): Promise<string> {
  const res = await fetch(path);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function buildDocDefinition(
  items: OrderItem[],
  logoDataUrl: string,
): TDocumentDefinitions {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const metaLines: Content[] = [
    {
      text: `Tanggal: ${formatDate(new Date())}`,
      fontSize: 9,
      color: "#555555",
    },
  ];

  const itemBlocks: Content[] = items.flatMap((item) => {
    const amount = item.price * item.quantity;
    return [
      { columns: [{ text: item.name, fontSize: 10, bold: true }] },
      {
        columns: [
          {
            text: `${item.quantity} x ${formatRupiah(item.price)}`,
            fontSize: 9,
            color: "#555555",
          },
          { text: formatRupiah(amount), fontSize: 10, alignment: "right" },
        ],
        margin: [0, 0, 0, 6],
      },
    ];
  });

  return {
    pageSize: { width: 227, height: "auto" },
    pageMargins: [16, 16, 16, 16],
    content: [
      {
        image: logoDataUrl,
        width: 60,
        alignment: "center",
        margin: [0, 0, 0, 8],
      },
      dashedLine(),
      ...metaLines,
      dashedLine(),
      {
        columns: [
          { text: "Item", fontSize: 9, bold: true },
          { text: "Total", fontSize: 9, bold: true, alignment: "right" },
        ],
        margin: [0, 0, 0, 6],
      },
      ...itemBlocks,
      dashedLine(),
      {
        columns: [
          { text: "Subtotal", fontSize: 10 },
          { text: formatRupiah(subtotal), fontSize: 10, alignment: "right" },
        ],
      },
      {
        columns: [
          {
            text: "Total Bayar",
            fontSize: 12,
            bold: true,
            margin: [0, 4, 0, 0],
          },
          {
            text: formatRupiah(subtotal),
            fontSize: 12,
            bold: true,
            alignment: "right",
            margin: [0, 4, 0, 0],
          },
        ],
      },
      dashedLine(),
      {
        text: "Terima kasih sudah berbelanja!",
        fontSize: 9,
        alignment: "center",
        italics: true,
        margin: [0, 8, 0, 0],
      },
    ],
    defaultStyle: { font: "Roboto" },
  };
}

function getPdfBlob(docDefinition: TDocumentDefinitions): Promise<Blob> {
  return new Promise((resolve) => {
    const pdf: any = pdfMake.createPdf(docDefinition);
    pdf.getBlob((blob: Blob) => resolve(blob));
  });
}

export async function generateReceiptPdf(
  items: OrderItem[],
  options: GenerateReceiptOptions = {},
) {
  const {
    fileName = `invoice-${dayjs().format("YYYYMMDDHHmmss")}.pdf`,
    action = "open",
    logoPath = "/logo.png",
  } = options;

  // PENTING: window.open() harus dipanggil PALING AWAL, sebelum ada `await`
  // apapun. Ini yang bikin Safari/iOS nganggep ini masih "direct user gesture"
  // dan gak nge-block sebagai popup. Tabnya sengaja dibuka kosong dulu,
  // URL-nya baru diisi belakangan setelah blob PDF siap.
  let preOpenedTab: Window | null = null;
  if (action === "open") {
    preOpenedTab = window.open("", "_blank");
  }

  const logoDataUrl = await loadImageAsDataUrl(logoPath);
  const docDefinition = buildDocDefinition(items, logoDataUrl);

  if (action === "blob") {
    return getPdfBlob(docDefinition);
  }

  const blob = await getPdfBlob(docDefinition);
  const blobUrl = URL.createObjectURL(blob);

  switch (action) {
    case "open": {
      if (preOpenedTab) {
        preOpenedTab.location.href = blobUrl;
      } else {
        // Fallback kalau tab gagal ke-pre-open (misal blocked total)
        window.open(blobUrl, "_blank");
      }
      // Revoke belakangan, kasih waktu browser buat load dulu
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }
    case "download": {
      // Trik anchor + download attribute - ini yang paling reliable buat
      // trigger native "Save PDF" di Android, dan tetep jalan normal di desktop
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }
    case "print": {
      const printTab = window.open(blobUrl, "_blank");
      printTab?.addEventListener("load", () => printTab.print());
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }
  }
}
