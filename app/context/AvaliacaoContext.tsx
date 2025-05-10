import React, { createContext, useContext, useState, ReactNode } from "react";

export type AvaliacaoData = {
  nota: number | null;
  comentario: string;
  preferencia: "Agrupar" | "Espalhar" | "Indiferente";
};

type AvaliacaoContextType = {
  avaliacao: AvaliacaoData;
  updateNota: (nota: number | null) => void;
  updateComentario: (comentario: string) => void;
  updatePreferencia: (
    preferencia: "Agrupar" | "Espalhar" | "Indiferente"
  ) => void;
  resetAvaliacao: () => void;
};

const AvaliacaoContext = createContext<AvaliacaoContextType | undefined>(
  undefined
);

export const AvaliacaoProvider = ({ children }: { children: ReactNode }) => {
  const [avaliacao, setAvaliacao] = useState<AvaliacaoData>({
    nota: null,
    comentario: "",
    preferencia: "Indiferente",
  });

  const updateNota = (nota: number | null) => {
    setAvaliacao((prev) => ({ ...prev, nota }));
  };

  const updateComentario = (comentario: string) => {
    setAvaliacao((prev) => ({ ...prev, comentario }));
  };

  const updatePreferencia = (
    preferencia: "Agrupar" | "Espalhar" | "Indiferente"
  ) => {
    setAvaliacao((prev) => ({ ...prev, preferencia }));
  };

  const resetAvaliacao = () => {
    setAvaliacao({
      nota: null,
      comentario: "",
      preferencia: "Indiferente",
    });
  };

  return (
    <AvaliacaoContext.Provider
      value={{
        avaliacao,
        updateNota,
        updateComentario,
        updatePreferencia,
        resetAvaliacao,
      }}
    >
      {children}
    </AvaliacaoContext.Provider>
  );
};

export const useAvaliacao = () => {
  const context = useContext(AvaliacaoContext);
  if (!context) {
    throw new Error("useAvaliacao must be used within an AvaliacaoProvider");
  }
  return context;
};
