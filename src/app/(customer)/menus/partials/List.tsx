"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { Masonry } from "@/components";
import MenuCard from "@/components/customer/MenuCard";
import { getMenusClient, type Menu } from "@/service/menu.service";

interface ListProps {
  initialMenus: Menu[];
  initialHasMore: boolean;
  searchQuery?: string;
  filter?: string;
}

const List = ({
  initialMenus,
  initialHasMore,
  searchQuery,
  filter,
}: ListProps) => {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const fetchMore = async () => {
    const nextPage = page + 1;
    const result = await getMenusClient(searchQuery, filter, nextPage);

    setMenus((prev) => [...prev, ...result.data]);
    setPage(nextPage);
    setHasMore(result.hasMore);
  };

  if (!menus.length) {
    return null;
  }

  return (
    <InfiniteScroll
      dataLength={menus.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-6">
          <Spin size="large" />
        </div>
      }
      endMessage={
        <div className="text-center text-gray-400 py-6 text-sm">
          Semua menu udah ditampilkan
        </div>
      }
    >
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        gutter={{ xs: 8, sm: 12, md: 16 }}
        items={menus as any}
        itemRender={(item: any) => {
          return <MenuCard key={item.id} menu={item} />;
        }}
      />
    </InfiniteScroll>
  );
};

export default List;
