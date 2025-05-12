import React, { createContext, useContext, useState, ReactNode } from "react";
import { TurmaData, TurmaDataInicial } from "../types";

type TurmasContextType = {
  turmas: Map<string, TurmaData>;
  selectedTurmas: Map<string, TurmaData>;
  addTurma: (id: string) => void;
  removeTurma: (id: string) => void;
  setPrioridade: (id: string, prioridade: number) => void;
  semNoturnaMinhaArea: boolean;
  updateSemNoturnaMinhaArea: () => void;
};

const TurmasContext = createContext<TurmasContextType | undefined>(undefined);

type Props = {
  initialTurmas: TurmaDataInicial[];
  children: ReactNode;
};

export const TurmasProvider = ({ initialTurmas, children }: Props) => {
  const [turmas] = useState<Map<string, TurmaData>>(() => {
    const map = new Map<string, TurmaData>();
    initialTurmas.forEach((turma) => {
      const newTurma: TurmaData = {
        ...turma,
        conflitos: new Set(turma.conflitos),
      };
      map.set(turma.id, newTurma);
    });
    return map;
  });

  const [selectedTurmas, setSelectedTurmas] = useState<Map<string, TurmaData>>(
    new Map()
  );

  const addTurma = (id: string) => {
    const turma = turmas.get(id);
    if (turma && !selectedTurmas.has(id)) {
      setSelectedTurmas((prev) => new Map(prev).set(id, { ...turma }));
    }
  };

  const removeTurma = (id: string) => {
    setSelectedTurmas((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const setPrioridade = (id: string, prioridade: number) => {
    setSelectedTurmas((prev) => {
      const newMap = new Map(prev);
      const turma = newMap.get(id);
      if (turma) {
        newMap.set(id, { ...turma, prioridade });
      }
      return newMap;
    });
  };

  const [semNoturnaMinhaArea, setSemNoturnaMinhaArea] = useState(false);

  const updateSemNoturnaMinhaArea = () => {
    setSemNoturnaMinhaArea((prev) => !prev);
  };

  return (
    <TurmasContext.Provider
      value={{
        turmas,
        selectedTurmas,
        addTurma,
        removeTurma,
        setPrioridade,
        semNoturnaMinhaArea,
        updateSemNoturnaMinhaArea,
      }}
    >
      {children}
    </TurmasContext.Provider>
  );
};

export const useTurmas = () => {
  const context = useContext(TurmasContext);
  if (!context) {
    throw new Error("useTurmas deve ser usado dentro de TurmasProvider");
  }
  return context;
};
