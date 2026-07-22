import {
  RiDashboardLine,
  RiRestaurantLine,
  RiBarChartLine,
  RiSettings3Line,
} from "@remixicon/react";

export const menus = [
  {
    category: "Menu",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        href: "/dashboard",
        icons: RiDashboardLine,
      },
      {
        id: "menu",
        title: "Kelola Menu",
        href: "/dashboard/menu",
        icons: RiRestaurantLine,
      },
      {
        id: "statistik",
        title: "Statistik Penjualan",
        href: "/dashboard/statistik",
        icons: RiBarChartLine,
      },
    ],
  },
  {
    category: "Pengaturan",
    items: [
      {
        id: "settings",
        title: "Pengaturan",
        href: "/dashboard/settings",
        icons: RiSettings3Line,
      },
    ],
  },
];
