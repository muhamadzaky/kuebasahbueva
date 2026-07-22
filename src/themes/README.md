# Ant Design Theme Configuration

This directory contains all theme configurations for Ant Design components.

## Structure

```
src/themes/
├── colors.ts          # Color definitions (used by all components)
├── fonts.ts           # Font definitions
├── index.ts           # Main theme configuration (combines all components)
├── dropdown.ts        # Dropdown component theme
├── menu.ts            # Menu component theme (used by dropdown)
└── [component].ts     # Add new component themes here (e.g., button.ts, modal.ts)
```

## How to add a new component theme

1. Create a new file in `src/themes/` (e.g., `button.ts`) with this structure:

   ```typescript
   import type { ThemeConfig } from "antd";
   import { colorTheme } from "./colors";

   const light: ThemeConfig["components"]["Button"] = {
     // Your light mode tokens here
   };

   const dark: ThemeConfig["components"]["Button"] = {
     // Your dark mode tokens here
   };

   export { light, dark };
   ```

2. Import and add it to `src/themes/index.ts`:
   ```typescript
   import { light as buttonLight, dark as buttonDark } from "./button";

   export const lightTheme: ThemeConfig = {
     // ...
     components: {
       // ...
       Button: buttonLight,
     },
   };

   export const darkTheme: ThemeConfig = {
     // ...
     components: {
       // ...
       Button: buttonDark,
     },
   };
   ```

## Color Definitions

All colors are defined in `colors.ts` as `colorTheme`:

- `primaryRed`: #F22F3D (Main brand color)
- `primaryBlack`: #1B1B1B (Dark theme main background)
- `primaryWhite`: #FFFFFF (Light theme main background)
