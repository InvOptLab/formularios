"use client";
import { Chip, ChipProps } from "@mui/material";
import { Nivel } from "../types";

/**
 * Rótulos e cores de cada nível de turma. Centralizado aqui para que card,
 * lista de prioridades e filtro usem sempre a mesma identidade visual.
 */
export const NIVEIS: Record<
  Nivel,
  { rotulo: string; rotuloCurto: string; cor: string; descricao: string }
> = {
  g: {
    rotulo: "Graduação",
    rotuloCurto: "Graduação",
    cor: "#1976d2",
    descricao: "Turma de graduação.",
  },
  p: {
    rotulo: "Pós-graduação",
    rotuloCurto: "Pós",
    cor: "#9c27b0",
    descricao: "Turma de pós-graduação.",
  },
  "g+p": {
    rotulo: "Graduação + Pós",
    rotuloCurto: "G + P",
    cor: "#00796b",
    descricao:
      "Turma espelho: a mesma turma é oferecida na graduação e na pós-graduação.",
  },
};

interface NivelChipProps extends Omit<ChipProps, "color" | "label"> {
  nivel: Nivel;
  /** "filled" (padrão) ou "outlined". */
  variant?: "filled" | "outlined";
}

const NivelChip = ({ nivel, variant = "filled", sx, ...props }: NivelChipProps) => {
  const { rotulo, cor } = NIVEIS[nivel] ?? NIVEIS.g;
  return (
    <Chip
      size="small"
      label={rotulo}
      variant={variant}
      sx={[
        variant === "filled"
          ? { backgroundColor: cor, color: "#fff" }
          : { borderColor: cor, color: cor },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export default NivelChip;
