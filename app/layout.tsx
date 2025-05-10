"use client";
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import { TurmasProvider } from "./context/TurmasContext";
import { turmasJson } from "./context/dados";
import { AvaliacaoProvider } from "./context/AvaliacaoContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <TurmasProvider initialTurmas={turmasJson}>
        <AvaliacaoProvider>
          <body style={{ padding: 15 }}>
            <CssBaseline />

            {children}
          </body>
        </AvaliacaoProvider>
      </TurmasProvider>
    </html>
  );
}
