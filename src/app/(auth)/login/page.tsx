"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, App, Card } from "antd";
import { RiLockLine, RiMailLine } from "@remixicon/react";
import { login } from "@/service/auth.service";
import Image from "next/image";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login berhasil!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      message.error("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md">
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/logo.png"
          alt="Kue Basah Bu Eva"
          width={120}
          height={120}
          className="mb-4"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Masuk ke dashboard
        </div>
      </div>

      <Form layout="vertical" onFinish={handleFinish} disabled={loading}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input
            prefix={<RiMailLine size={16} />}
            placeholder="admin@kuebasahbueva.com"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password wajib diisi" }]}
        >
          <Input.Password
            prefix={<RiLockLine size={16} />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          className="mt-2!"
        >
          Masuk
        </Button>
      </Form>
    </Card>
  );
}
