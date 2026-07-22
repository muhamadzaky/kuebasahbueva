import type { Metadata } from "next";
import { plusJakartaSans, inter } from "@/themes/fonts";
import "../styles/globals.scss";
import ThemeProvider from "@/components/ThemeProvider";
import ConfigProvider from "@/provider/ConfigProvider";
import QueryProvider from "@/provider/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Kue Basah Bu Eva",
  manifest: "/manifest.json",
};

function ThemeInitScript() {
  return (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const stored = localStorage.getItem('theme-storage');
              let theme = 'system';
              if (stored) {
                try {
                  const parsed = JSON.parse(stored);
                  theme = parsed.state?.theme || 'system';
                } catch (parseError) {
                  console.warn('Failed to parse theme storage:', parseError);
                }
              }
              const root = document.documentElement;
              root.classList.remove('light', 'dark');
              if (theme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(systemDark ? 'dark' : 'light');
                } else {
                  root.classList.add(theme);
              }
              console.log("ThemeInit:", theme);
            } catch (e) {
              console.error('Failed to init theme:', e);
            }
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider>
            <ConfigProvider>{children}</ConfigProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
