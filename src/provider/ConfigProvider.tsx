"use client";

import { ConfigProvider as AntdConfigProvider, App as AntdApp } from "antd";
import { useTheme } from "@/hooks/useTheme";
import { lightTheme, darkTheme } from "@/themes";
import { useState, useEffect } from "react";

const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const [antdTheme, setAntdTheme] = useState(lightTheme);

  useEffect(() => {
    const updateTheme = () => {
      if (theme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setAntdTheme(systemDark ? darkTheme : lightTheme);
      } else {
        setAntdTheme(theme === "dark" ? darkTheme : lightTheme);
      }
    };

    updateTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <AntdConfigProvider theme={antdTheme}>
      <AntdApp>{children}</AntdApp>
    </AntdConfigProvider>
  );
};

export default ConfigProvider;
