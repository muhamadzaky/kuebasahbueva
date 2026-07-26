"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Upload, App, Image } from "antd";
import type { UploadFile } from "antd";
import { RiDeleteBin6Line, RiUploadLine } from "@remixicon/react";
import ImgCrop from "antd-img-crop";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { useProfile, useUpdateProfile } from "@/service/profile.service";

interface ProfileFormValues {
  name: string;
}

export default function ProfilePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<ProfileFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [removeExistingAvatar, setRemoveExistingAvatar] = useState(false);

  const profile = useProfile();
  const updateProfile = useUpdateProfile();

  const hasExistingAvatar =
    Boolean(profile.data?.avatar_path) && !removeExistingAvatar;
  const existingAvatarUrl = hasExistingAvatar
    ? (profile.data?.avatarUrl ?? null)
    : null;

  useEffect(() => {
    if (profile.data) {
      form.setFieldsValue({ name: profile.data.name ?? "" });
    }
  }, [profile.data, form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    const imageFile = fileList[0]?.originFileObj as File | undefined;

    try {
      await updateProfile.mutateAsync({
        name: values.name,
        originalAvatarPath: profile.data?.avatar_path,
        currentAvatarPath: removeExistingAvatar
          ? null
          : profile.data?.avatar_path,
        imageFile,
      });
      message.success("Profile berhasil diupdate");
      setFileList([]);
      setRemoveExistingAvatar(false);
      router.refresh();
    } catch (error) {
      message.error("Terjadi kesalahan, coba lagi");
    }
  };

  return (
    <PageWrapper
      title="Profile"
      description="Kelola informasi akun kamu"
      breadcrumbItems={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Profile" },
      ]}
    >
      <Card className="max-w-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={profile.isLoading}
        >
          <Form.Item label="Foto Profile">
            {hasExistingAvatar && existingAvatarUrl ? (
              <div className="relative w-24 h-24">
                <Image
                  src={existingAvatarUrl}
                  alt="Foto profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-24 h-24"
                  preview={false}
                />
                <Button
                  size="small"
                  danger
                  shape="circle"
                  icon={<RiDeleteBin6Line size={12} />}
                  className="absolute! -top-2 -right-2"
                  classNames={{ icon: "h-inherit!" }}
                  onClick={() => setRemoveExistingAvatar(true)}
                />
              </div>
            ) : (
              <>
                <ImgCrop rotationSlider aspect={1}>
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
                {profile.data?.avatar_path && removeExistingAvatar && (
                  <div className="text-xs text-gray-500 mt-1">
                    Foto lama akan dihapus setelah disimpan
                  </div>
                )}
              </>
            )}
          </Form.Item>

          <Form.Item label="Email">
            <Input value={profile.data?.email ?? ""} disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nama Lengkap"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input placeholder="Nama kamu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={updateProfile.isPending}
          >
            Simpan Perubahan
          </Button>
        </Form>
      </Card>
    </PageWrapper>
  );
}
