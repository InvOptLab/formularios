"use client";
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ padding: 15 }}>
        <CssBaseline />

        {children}
      </body>
    </html>
  );
}
