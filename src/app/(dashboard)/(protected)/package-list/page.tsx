"use client";

import { useState } from "react";
import { Button, Table, App, Image, Tag } from "antd";
import { RiAddLine, RiDeleteBin6Line, RiEditLine } from "@remixicon/react";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { getNumberColumn } from "@/utils/tableColumns";
import {
  usePackages,
  useDeletePackage,
  type Package,
} from "@/service/packages.service";
import { getImageUrl } from "@/utils/uploadImage";
import usePackageModalStore from "./store";
import PackageModal from "./partials/PackageModal";

export default function PackagesPage() {
  const { message, modal } = App.useApp();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const packages = usePackages({
    page: pagination.current,
    pageSize: pagination.pageSize,
  });
  const deletePackage = useDeletePackage();

  const { openCreateModal, openEditModal } = usePackageModalStore(
    (state) => state,
  );

  const handleDelete = (pkg: Package) => {
    modal.confirm({
      title: `Hapus "${pkg.name}"?`,
      content: "Package yang dihapus tidak bisa dikembalikan.",
      centered: true,
      okText: "Ya, hapus",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePackage.mutateAsync(pkg);
          message.success("Package berhasil dihapus");
        } catch (error) {
          message.error("Gagal menghapus package");
        }
      },
    });
  };

  return (
    <PageWrapper
      title="Kelola Packaging"
      description="Kelola jenis box/packaging yang tersedia"
      breadcrumbItems={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Packaging" },
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<RiAddLine size={16} />}
          onClick={openCreateModal}
        >
          Tambah Package
        </Button>
      </div>

      <Table
        loading={packages.isLoading}
        dataSource={packages.data?.data}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: packages.data?.total ?? 0,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} package`,
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
                  alt="package"
                  width={48}
                  height={48}
                  className="rounded object-cover"
                />
              ) : (
                <div className="size-12 rounded bg-[#F5F5F5]" />
              );
            },
          },
          { title: "Urutan", dataIndex: "order", width: 80 },
          { title: "Nama", dataIndex: "name" },
          {
            title: "Harga",
            dataIndex: "price",
            render: (price: number) =>
              price > 0 ? `Rp ${price.toLocaleString("id-ID")}` : "Gratis",
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
              const item = record as Package;
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

      <PackageModal />
    </PageWrapper>
  );
}
