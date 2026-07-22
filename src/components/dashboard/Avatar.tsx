"use client";

import {
  RiArrowDownSLine,
  RiLogoutBoxRLine,
  RiUser3Line,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
} from "@remixicon/react";
import { Avatar as AntAvatar, Dropdown, Modal, Segmented } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { colorTheme } from "@/themes/colors";
import { useTheme } from "@/hooks/useTheme";

const { confirm } = Modal;

// TODO: sambungin ke user beneran dari Supabase Auth
const DUMMY_USER = {
  name: "Admin",
  avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
};

export default function AppAvatar({
  onlyImage = false,
}: {
  onlyImage?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/dashboard/profile">Profile</Link>,
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
        confirm({
          title: "Yakin mau logout?",
          okText: "Logout",
          onOk: () => {
            // TODO: panggil supabase.auth.signOut() + redirect ke /dashboard/login
          },
        });
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]}>
      <div className="flex items-center gap-3 cursor-pointer max-w-50 overflow-hidden bg-primary-white rounded-lg p-2 dark:bg-gray-800">
        <AntAvatar src={DUMMY_USER.avatarUrl} size={36} />
        {!onlyImage && (
          <span className="text-[#1B1B1B] font-medium truncate dark:text-white">
            {DUMMY_USER.name}
          </span>
        )}
        {!onlyImage && (
          <RiArrowDownSLine
            size={16}
            color={colorTheme.primaryBlack}
            className="dark:text-gray-300"
          />
        )}
      </div>
    </Dropdown>
  );
}
