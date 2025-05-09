"use client";
// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { FontSizeProvider } from "./context/FontSizeContext";
import { theme } from "./utils/theme";
// import FontSizeControls from "./components/FontSizeControls";
// export const metadata = {
//   title: "Seu App",
//   description: "Descrição do seu app",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ padding: 15 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FontSizeProvider>
            {/* <FontSizeControls /> */}
            {children}
          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
