"use client";
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import { TurmasProvider } from "./context/TurmasContext";
import { AvaliacaoProvider } from "./context/AvaliacaoContext";
import { AlertsWrapper } from "./context/AlertasContext";
import { turmasJson } from "./context/dados";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ padding: 15 }}>
        <AlertsWrapper>
          <TurmasProvider initialTurmas={turmasJson}>
            <AvaliacaoProvider>
              <CssBaseline />

              {children}
            </AvaliacaoProvider>
          </TurmasProvider>
        </AlertsWrapper>
      </body>
    </html>
  );
}
