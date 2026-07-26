"use client";

import { useState } from "react";
import { Button, Table, App, Image, Tag } from "antd";
import { RiAddLine, RiDeleteBin6Line, RiEditLine } from "@remixicon/react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { getNumberColumn } from "@/utils/tableColumns";
import { useMenus, useDeleteMenu, type Menu } from "@/service/menu.service";
import { getImageUrl } from "@/utils/uploadImage";
import useMenuModalStore from "./store";
import MenuModal from "./partials/MenuModal";

export default function MenuPage() {
  const { message, modal } = App.useApp();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const menus = useMenus({
    page: pagination.current,
    pageSize: pagination.pageSize,
  });
  const deleteMenu = useDeleteMenu();

  const { openCreateModal, openEditModal } = useMenuModalStore(
    (state) => state,
  );

  const handleDelete = (menu: Menu) => {
    modal.confirm({
      title: `Hapus "${menu.name}"?`,
      content: "Menu yang dihapus tidak bisa dikembalikan.",
      centered: true,
      okText: "Ya, hapus",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMenu.mutateAsync(menu);
          message.success("Menu berhasil dihapus");
        } catch (error) {
          message.error("Gagal menghapus menu");
        }
      },
    });
  };

  return (
    <PageWrapper
      title="Kelola Menu"
      description="Kelola daftar kue yang dijual"
      breadcrumbItems={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Menu" },
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<RiAddLine size={16} />}
          onClick={openCreateModal}
        >
          Tambah Menu
        </Button>
      </div>

      <Table
        loading={menus.isLoading}
        dataSource={menus.data?.data}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: menus.data?.total ?? 0,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} menu`,
        }}
        columns={[
          getNumberColumn({
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          }),
          {
            title: "Gambar",
            dataIndex: "image_path",
            width: 80,
            render: (imagePath: string | null) => {
              const url = getImageUrl(imagePath);
              return url ? (
                <Image
                  src={url}
                  alt="menu"
                  width={48}
                  height={48}
                  className="rounded object-cover"
                />
              ) : (
                <div className="size-12 rounded bg-[#F5F5F5]" />
              );
            },
          },
          { title: "Nama", dataIndex: "name" },
          {
            title: "Harga",
            dataIndex: "price",
            render: (price: number) =>
              `Rp ${(price ?? 0).toLocaleString("id-ID")}`,
          },
          {
            title: "Ditampilkan",
            dataIndex: "is_active",
            render: (isActive: boolean) => (
              <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Aktif" : "Nonaktif"}
              </Tag>
            ),
          },
          {
            title: "Aksi",
            width: 120,
            render: (_, record) => {
              const item = record as Menu;
              return (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<RiEditLine size={14} />}
                    onClick={() => openEditModal(item)}
                  />
                  <Button
                    size="small"
                    danger
                    icon={<RiDeleteBin6Line size={14} />}
                    onClick={() => handleDelete(item)}
                  />
                </div>
              );
            },
          },
        ]}
      />

      <MenuModal />
    </PageWrapper>
  );
}
