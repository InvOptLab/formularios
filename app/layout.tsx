// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Formulário de Atribuição de Disciplinas — SME/ICMC",
  description:
    "Seleção e priorização de turmas para o processo de atribuição de carga didática do SME/ICMC.",
  // Ícones e manifest vêm das convenções de arquivo do Next em app/
  // (favicon.ico, icon.svg, apple-icon.png, manifest.ts). Assim o Next aplica
  // automaticamente o basePath do GitHub Pages (/formularios) e um hash de cache.
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
