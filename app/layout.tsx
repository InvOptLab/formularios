// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Sistema de Formulários",
  description:
    "Seleção e priorização de turmas para o processo de atribuição de carga didática do SME/ICMC.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1976d2",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Garante que os estilos do MUI/Emotion gerados no servidor coincidam com os do cliente (evita erro de hidratação) */}
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
