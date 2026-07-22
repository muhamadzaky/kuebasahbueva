import { theme as antTheme } from "antd";
import type { ThemeConfig } from "antd";
import { colorTheme } from "./colors";
import { light as dropdownLight, dark as dropdownDark } from "./dropdown";
import { light as menuLight, dark as menuDark } from "./menu";

// Light mode base tokens
const lightBase: ThemeConfig["token"] = {
  colorPrimary: colorTheme.primaryRed,
  colorText: colorTheme.primaryBlack,
  colorBgElevated: colorTheme.primaryWhite,
  colorError: colorTheme.primaryRed,
  colorTextLightSolid: colorTheme.primaryWhite,
  fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif",
};

// Dark mode base tokens
const darkBase: ThemeConfig["token"] = {
  colorPrimary: colorTheme.primaryRed,
  colorText: colorTheme.primaryWhite,
  colorBgElevated: "#1a1a1a",
  colorError: colorTheme.primaryRed,
  colorTextLightSolid: colorTheme.primaryWhite,
  colorBgContainer: "#1f1f1f",
  colorBgSpotlight: colorTheme.primaryRed,
  fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif",
};

export const lightTheme: ThemeConfig = {
  token: lightBase,
  components: {
    Dropdown: dropdownLight,
    Menu: menuLight,
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: darkBase,
  components: {
    Dropdown: dropdownDark,
    Menu: menuDark,
  },
};
