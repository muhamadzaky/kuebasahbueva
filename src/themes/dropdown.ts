import { colorTheme } from "./colors";

const light = {
  paddingBlock: 5,
  zIndexPopup: 1050,

  colorBgElevated: colorTheme.primaryWhite,
  colorError: colorTheme.primaryRed,

  colorIcon: "rgba(0,0,0,0.45)",

  // Brand
  colorPrimary: colorTheme.primaryRed,
  colorPrimaryBorder: "#FF9AA5",

  colorSplit: "rgba(5,5,5,0.06)",

  colorText: colorTheme.primaryBlack,
  colorTextDescription: "rgba(0,0,0,0.45)",
  colorTextDisabled: "rgba(0,0,0,0.25)",
  colorTextLightSolid: colorTheme.primaryWhite,

  borderRadiusLG: 8,
  borderRadiusSM: 4,
  borderRadiusXS: 2,

  boxShadowSecondary:
    "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",

  controlHeightLG: 40,

  // Active / Hover
  controlItemBgActive: "#FFE8EB",
  controlItemBgActiveHover: "#FFC2C9",
  controlItemBgHover: "rgba(242,47,61,0.06)",

  controlPaddingHorizontal: 12,

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

  fontSize: 14,
  fontSizeIcon: 12,
  fontSizeSM: 12,

  lineHeight: 1.5714285714285714,
  lineWidthFocus: 3,

  marginXS: 8,
  marginXXS: 4,

  motionDurationMid: "0.2s",
  motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
  motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
  motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",

  padding: 16,
  paddingXS: 8,
  paddingXXS: 4,

  sizePopupArrow: 16,
};

const dark = {
  paddingBlock: 5,
  zIndexPopup: 1050,

  colorBgElevated: colorTheme.primaryBlack,
  colorError: colorTheme.primaryRed,

  colorIcon: "rgba(255,255,255,0.65)",

  // Brand
  colorPrimary: colorTheme.primaryRed,
  colorPrimaryBorder: "#FF6B78",

  colorSplit: "rgba(255,255,255,0.12)",

  colorText: colorTheme.primaryWhite,
  colorTextDescription: "rgba(255,255,255,0.65)",
  colorTextDisabled: "rgba(255,255,255,0.35)",
  colorTextLightSolid: colorTheme.primaryWhite,

  borderRadiusLG: 8,
  borderRadiusSM: 4,
  borderRadiusXS: 2,

  boxShadowSecondary:
    "0 6px 16px 0 rgba(0,0,0,0.32), 0 3px 6px -4px rgba(0,0,0,0.48), 0 9px 28px 8px rgba(0,0,0,0.2)",

  controlHeightLG: 40,

  // Active / Hover
  controlItemBgActive: colorTheme.primaryRed,
  controlItemBgActiveHover: "#FF4D5D",
  controlItemBgHover: "rgba(242,47,61,0.12)",

  controlPaddingHorizontal: 12,

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

  fontSize: 14,
  fontSizeIcon: 12,
  fontSizeSM: 12,

  lineHeight: 1.5714285714285714,
  lineWidthFocus: 3,

  marginXS: 8,
  marginXXS: 4,

  motionDurationMid: "0.2s",
  motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
  motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
  motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",

  padding: 16,
  paddingXS: 8,
  paddingXXS: 4,

  sizePopupArrow: 16,
};

export { light, dark };
