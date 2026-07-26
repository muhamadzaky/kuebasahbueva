"use client";

import {
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiUser3Line,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
} from "@remixicon/react";
import { Avatar as AntAvatar, Dropdown, App, Segmented } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { colorTheme } from "@/themes/colors";
import { useTheme } from "@/hooks/useTheme";
import { useProfile } from "@/service/profile.service";
import { logout } from "@/service/auth.service";

export default function AppAvatar({
  onlyImage = false,
}: {
  onlyImage?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const { modal, message } = App.useApp();
  const router = useRouter();

  const profile = useProfile();

  const displayName = `Halo${profile.data?.name || profile.data?.email ? `, ${profile.data.name || profile.data.email}` : ""}!`;
  const avatarUrl = profile.data?.avatarUrl;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      message.error("Gagal logout, coba lagi");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <RiUser3Line size={14} />,
    },
    {
      key: "theme",
      label: (
        <div className="py-2">
          <div className="text-xs text-gray-500 mb-2">Theme</div>
          <Segmented
            value={theme}
            onChange={(value) => setTheme(value as "light" | "dark" | "system")}
            options={[
              { value: "light", icon: <RiSunLine size={14} /> },
              { value: "dark", icon: <RiMoonLine size={14} /> },
              { value: "system", icon: <RiComputerLine size={14} /> },
            ]}
            size="small"
          />
        </div>
      ),
      icon: <RiSunLine size={14} />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <RiLogoutBoxRLine size={14} />,
      danger: true,
      onClick: () => {
        modal.confirm({
          title: "Yakin mau logout?",
          centered: true,
          okText: "Logout",
          okButtonProps: { danger: true },
          cancelText: "Batal",
          onOk: handleLogout,
        });
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]}>
      <div className="flex items-center gap-3 cursor-pointer max-w-50 overflow-hidden bg-primary-white rounded-lg p-2 dark:bg-[#181818]">
        {avatarUrl ? (
          <AntAvatar src={avatarUrl} size={36} className="min-w-[36px]" />
        ) : (
          <div className="w-[36px] min-w-[36px] h-[36px] rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <RiUser3Line size={20} color={colorTheme.primaryBlack} />
          </div>
        )}
        {!onlyImage && (
          <span className="text-[#1B1B1B] font-medium truncate dark:text-white">
            {displayName}
          </span>
        )}
        {!onlyImage && <RiArrowDownSLine size={18} />}
      </div>
    </Dropdown>
  );
}
