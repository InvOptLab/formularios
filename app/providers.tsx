"use client";
// app/providers.tsx
import { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ptBR } from "@mui/material/locale";
import { TurmasProvider } from "./context/TurmasContext";
import { AvaliacaoProvider } from "./context/AvaliacaoContext";
import { AlertsWrapper } from "./context/AlertasContext";
import { turmasJson } from "./context/dados";

const theme = createTheme(
  {
    palette: {
      background: { default: "#f6f7fb" },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: { root: { textTransform: "none", fontWeight: 600 } },
      },
    },
  },
  ptBR
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertsWrapper>
        <TurmasProvider initialTurmas={turmasJson}>
          <AvaliacaoProvider>{children}</AvaliacaoProvider>
        </TurmasProvider>
      </AlertsWrapper>
    </ThemeProvider>
  );
}
