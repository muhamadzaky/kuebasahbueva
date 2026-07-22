"use client";

import { Masonry } from "@/components";
import MenuCard from "@/components/customer/MenuCard";

const List = ({ menus }: { menus: any }) => {
  if (!menus.length) {
    return null;
  }

  return (
    <Masonry
      columns={{ xs: 1, sm: 2, md: 3 }}
      gutter={{ xs: 8, sm: 12, md: 16 }}
      items={menus}
      itemRender={(item: any) => {
        return <MenuCard key={item.id} menu={item} />;
      }}
    />
  );
};

export default List;
