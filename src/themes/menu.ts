import { colorTheme } from "./colors";

const light = {
  itemBg: "transparent",
  itemColor: colorTheme.primaryBlack,

  itemHoverBg: "rgba(242,47,61,0.06)",
  itemHoverColor: colorTheme.primaryRed,

  itemSelectedBg: colorTheme.primaryRed,
  itemSelectedColor: colorTheme.primaryWhite,

  iconSize: 14,
};

const dark = {
  itemBg: "transparent",
  itemColor: colorTheme.primaryWhite,

  itemHoverBg: "rgba(242,47,61,0.12)",
  itemHoverColor: colorTheme.primaryWhite,

  itemSelectedBg: colorTheme.primaryRed,
  itemSelectedColor: colorTheme.primaryWhite,

  iconSize: 14,
};

export { light, dark };
