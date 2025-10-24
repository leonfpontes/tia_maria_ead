import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ThemeRegistry from "../providers/theme-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tia Maria EAD",
  description: "Plataforma de cursos da Tia Maria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeRegistry>
            <CssBaseline />
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
