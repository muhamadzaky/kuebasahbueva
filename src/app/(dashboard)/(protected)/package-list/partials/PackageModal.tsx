"use client";

import { useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  App,
  Image,
} from "antd";
import { RiDeleteBin6Line, RiUploadLine } from "@remixicon/react";
import ImgCrop from "antd-img-crop";
import { useCreatePackage, useUpdatePackage } from "@/service/packages.service";
import { getImageUrl } from "@/utils/uploadImage";
import usePackageModalStore from "../store";

interface PackageFormValues {
  name: string;
  price: number;
  is_active: boolean;
  order: number;
}

const PackageModal = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<PackageFormValues>();

  const {
    modalOpen,
    editingPackage,
    fileList,
    removeExistingImage,
    closeModal,
    setFileList,
    setRemoveExistingImage,
  } = usePackageModalStore((state) => state);

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const isSubmitting = createPackage.isPending || updatePackage.isPending;

  const hasExistingImage =
    Boolean(editingPackage?.image_path) && !removeExistingImage;
  const existingImageUrl = hasExistingImage
    ? getImageUrl(editingPackage!.image_path)
    : null;

  // Sinkronin form fields tiap kali modal dibuka (create atau edit)
  useEffect(() => {
    if (modalOpen) {
      if (editingPackage) {
        form.setFieldsValue({
          name: editingPackage.name,
          price: editingPackage.price,
          is_active: editingPackage.is_active,
          order: editingPackage.order,
        });
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, editingPackage, form]);

  const handleSubmit = async (values: PackageFormValues) => {
    const imageFile = fileList[0]?.originFileObj as File | undefined;

    try {
      if (editingPackage) {
        await updatePackage.mutateAsync({
          id: editingPackage.id,
          originalImagePath: editingPackage.image_path,
          currentImagePath: removeExistingImage
            ? null
            : editingPackage.image_path,
          ...values,
          imageFile,
        });
        message.success("Package berhasil diupdate");
      } else {
        await createPackage.mutateAsync({ ...values, imageFile });
        message.success("Package berhasil ditambahkan");
      }
      closeModal();
      form.resetFields();
    } catch (error) {
      message.error("Terjadi kesalahan, coba lagi");
    }
  };

  return (
    <Modal
      title={editingPackage ? "Edit Package" : "Tambah Package"}
      open={modalOpen}
      onCancel={closeModal}
      centered
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Nama Package"
          rules={[{ required: true, message: "Nama wajib diisi" }]}
        >
          <Input placeholder="Snack Box Small" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Harga"
          rules={[{ required: true, message: "Harga wajib diisi" }]}
        >
          <InputNumber<number>
            className="w-full!"
            min={0}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value?.replace(/Rp\s?|(,*)/g, "") ?? 0)}
          />
        </Form.Item>

        <Form.Item name="order" label="Urutan Tampil">
          <InputNumber className="w-full!" min={1} />
        </Form.Item>

        <Form.Item label="Gambar">
          {hasExistingImage && existingImageUrl ? (
            <div className="relative w-24 h-24">
              <Image
                src={existingImageUrl}
                alt="Gambar package"
                width={96}
                height={96}
                className="rounded object-cover w-24 h-24"
                preview={false}
              />
              <Button
                size="small"
                danger
                shape="circle"
                icon={<RiDeleteBin6Line size={12} />}
                className="absolute! -top-2 -right-2"
                classNames={{ icon: "h-inherit!" }}
                onClick={() => setRemoveExistingImage(true)}
              />
            </div>
          ) : (
            <>
              <ImgCrop rotationSlider>
                <Upload
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setFileList(fileList)}
                  maxCount={1}
                  accept="image/*"
                  listType="picture-card"
                >
                  {fileList.length === 0 && (
                    <div className="flex flex-col items-center">
                      <RiUploadLine />
                      <div className="mt-2">Upload</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
              {editingPackage?.image_path && removeExistingImage && (
                <div className="text-xs text-gray-500 mt-1">
                  Gambar lama akan dihapus setelah disimpan
                </div>
              )}
            </>
          )}
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Tampilkan Package"
          rules={[{ required: true, message: "Status wajib diisi" }]}
        >
          <Select
            className="w-full!"
            options={[
              { label: "Ditampilkan", value: true },
              { label: "Tidak Ditampilkan", value: false },
            ]}
            placeholder="Pilih status tampilan package"
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={closeModal}>Batal</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Simpan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PackageModal;
