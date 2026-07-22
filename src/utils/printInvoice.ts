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
  storeInfo?: string[]; // baris-baris info di bawah nama toko, misal alamat, no. HP
  invoiceNo?: string;
  tableNo?: string;
  fileName?: string;
  action?: "open" | "download" | "print" | "blob";
  logoPath?: string; // default "/logo.png"
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

// Garis putus-putus, simple pakai text repeated dash
function dashedLine(): Content {
  return {
    text: "- ".repeat(46),
    fontSize: 8,
    color: "#999999",
    margin: [0, 4, 0, 4],
  };
}

// Convert image di /public jadi base64 dataURL biar bisa dipakai pdfmake
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

export async function generateReceiptPdf(
  items: OrderItem[],
  options: GenerateReceiptOptions = {},
) {
  const {
    // invoiceNo,
    fileName = `invoice-${dayjs().format("YYYYMMDDHHmmss")}.pdf`,
    action = "open",
    logoPath = "/logo.png",
  } = options;

  const logoDataUrl = await loadImageAsDataUrl(logoPath);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Header info (invoice no, tanggal) - opsional, tampil kalau ada
  const metaLines: Content[] = [];
  // if (invoiceNo) {
  //   metaLines.push({
  //     text: `No. Invoice: ${invoiceNo}`,
  //     fontSize: 9,
  //     color: "#555555",
  //   });
  // }
  metaLines.push({
    text: `Tanggal: ${formatDate(new Date())}`,
    fontSize: 9,
    color: "#555555",
  });

  // Baris item, tiap item = 2 baris: nama di kiri, qty x harga = amount di kanan bawahnya
  const itemBlocks: Content[] = items.flatMap((item) => {
    const amount = item.price * item.quantity;
    return [
      {
        columns: [{ text: item.name, fontSize: 10, bold: true }],
      },
      {
        columns: [
          {
            text: `${item.quantity} x ${formatRupiah(item.price)}`,
            fontSize: 9,
            color: "#555555",
          },
          {
            text: formatRupiah(amount),
            fontSize: 10,
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 6],
      },
    ];
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: { width: 227, height: "auto" }, // ~80mm thermal receipt width
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
    defaultStyle: {
      font: "Roboto",
    },
  };

  const pdf: any = pdfMake.createPdf(docDefinition);

  switch (action) {
    case "download":
      pdf.download(fileName);
      return;
    case "print":
      pdf.print();
      return;
    case "blob":
      return new Promise<Blob>((resolve) => {
        pdf.getBlob((blob: Blob) => resolve(blob));
      });
    case "open":
    default:
      pdf.open();
      return;
  }
}
