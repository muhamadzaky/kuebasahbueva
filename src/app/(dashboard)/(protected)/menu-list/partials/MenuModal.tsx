"use client";

import { useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  App,
  Image,
  Select,
} from "antd";
import { RiDeleteBin6Line, RiUploadLine } from "@remixicon/react";
import ImgCrop from "antd-img-crop";
import { useCreateMenu, useUpdateMenu } from "@/service/menu.service";
import { getImageUrl } from "@/utils/uploadImage";
import useMenuModalStore from "../store";

interface MenuFormValues {
  name: string;
  price: number;
  is_active: boolean;
}

const MenuModal = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<MenuFormValues>();

  const {
    modalOpen,
    editingMenu,
    fileList,
    removeExistingImage,
    closeModal,
    setFileList,
    setRemoveExistingImage,
  } = useMenuModalStore((state) => state);

  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const isSubmitting = createMenu.isPending || updateMenu.isPending;

  const hasExistingImage =
    Boolean(editingMenu?.image_path) && !removeExistingImage;
  const existingImageUrl = hasExistingImage
    ? getImageUrl(editingMenu!.image_path)
    : null;

  // Sinkronin form fields tiap kali modal dibuka (create atau edit)
  useEffect(() => {
    if (modalOpen) {
      if (editingMenu) {
        form.setFieldsValue({
          name: editingMenu.name,
          price: editingMenu.price,
          is_active: editingMenu.is_active,
        });
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, editingMenu, form]);

  const handleSubmit = async (values: MenuFormValues) => {
    const imageFile = fileList[0]?.originFileObj as File | undefined;

    try {
      if (editingMenu) {
        await updateMenu.mutateAsync({
          id: editingMenu.id,
          originalImagePath: editingMenu.image_path,
          currentImagePath: removeExistingImage ? null : editingMenu.image_path,
          ...values,
          imageFile,
        });
        message.success("Menu berhasil diupdate");
      } else {
        await createMenu.mutateAsync({ ...values, imageFile });
        message.success("Menu berhasil ditambahkan");
      }
      closeModal();
      form.resetFields();
    } catch (error) {
      message.error("Terjadi kesalahan, coba lagi");
    }
  };

  return (
    <Modal
      title={editingMenu ? "Edit Menu" : "Tambah Menu"}
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
          label="Nama Menu"
          rules={[{ required: true, message: "Nama wajib diisi" }]}
        >
          <Input placeholder="Lemper Ayam" />
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

        <Form.Item label="Gambar">
          {hasExistingImage && existingImageUrl ? (
            <div className="relative w-24 h-24">
              <Image
                src={existingImageUrl}
                alt="Gambar menu"
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
              {editingMenu?.image_path && removeExistingImage && (
                <div className="text-xs text-gray-500 mt-1">
                  Gambar lama akan dihapus setelah disimpan
                </div>
              )}
            </>
          )}
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Tampilkan Menu"
          rules={[{ required: true, message: "Status wajib diisi" }]}
        >
          <Select
            className="w-full!"
            options={[
              { label: "Ditampilkan", value: true },
              { label: "Tidak Ditampilkan", value: false },
            ]}
            placeholder="Pilih status tampilan menu"
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

export default MenuModal;
