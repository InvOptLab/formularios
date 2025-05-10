"use client";
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import { TurmasProvider } from "./context/TurmasContext";
import { turmasJson } from "./context/dados";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <TurmasProvider initialTurmas={turmasJson}>
        <body style={{ padding: 15 }}>
          <CssBaseline />

          {children}
        </body>
      </TurmasProvider>
    </html>
  );
}
