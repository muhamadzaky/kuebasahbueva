import { RiDashboardLine, RiRestaurantLine } from "@remixicon/react";

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
        href: "/menu-list",
        icons: RiRestaurantLine,
      },
      {
        id: "package",
        title: "Kelola Package",
        href: "/package-list",
        icons: RiRestaurantLine,
      },
    ],
  },
  // {
  //   category: "Pengaturan",
  //   items: [
  //     {
  //       id: "settings",
  //       title: "Pengaturan",
  //       href: "/settings",
  //       icons: RiSettings3Line,
  //     },
  //   ],
  // },
];
