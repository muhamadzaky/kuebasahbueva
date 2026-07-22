import { colorTheme } from "./colors";

const light = {
  contentBg: colorTheme.primaryWhite,
  headerBg: colorTheme.primaryWhite,
  footerBg: "transparent",
  titleColor: colorTheme.primaryBlack,
  titleFontSize: 16,
  colorBgMask: "rgba(0,0,0,0.55)",
  borderRadiusLG: 12,
};

const dark = {
  contentBg: "#1a1a1a",
  headerBg: "#1a1a1a",
  footerBg: "transparent",
  titleColor: colorTheme.primaryWhite,
  titleFontSize: 16,
  colorBgMask: "rgba(0,0,0,0.65)",
  borderRadiusLG: 12,
};

export { light, dark };
