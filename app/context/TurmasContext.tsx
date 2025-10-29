import React, { createContext, useContext, useState, ReactNode } from "react";
import { TurmaData, TurmaDataInicial } from "../types";

type TurmasContextType = {
  turmas: Map<string, TurmaData>;
  selectedTurmas: Map<string, TurmaData>;
  addTurma: (uuid: string) => void;
  removeTurma: (uuid: string) => void;
  setPrioridade: (uuid: string, prioridade: number) => void;
  semNoturnaMinhaArea: boolean;
  updateSemNoturnaMinhaArea: () => void;
};

const TurmasContext = createContext<TurmasContextType | undefined>(undefined);

type Props = {
  initialTurmas: TurmaDataInicial[];
  children: ReactNode;
};

export const TurmasProvider = ({ initialTurmas, children }: Props) => {
  //const [turmasNew, setTurmas] = useState<Map<string, TurmaData>>(new Map());

  const [turmas] = useState<Map<string, TurmaData>>(() => {
    const map = new Map<string, TurmaData>();
    initialTurmas.forEach((turma) => {
      const newTurma: TurmaData = {
        ...turma,
        conflitos: new Set(turma.conflitos),
      };
      map.set(turma.uuid, newTurma);
    });
    return map;
  });

  const [selectedTurmas, setSelectedTurmas] = useState<Map<string, TurmaData>>(
    new Map()
  );

  const addTurma = (uuid: string) => {
    const turma = turmas.get(uuid);
    if (turma && !selectedTurmas.has(uuid)) {
      setSelectedTurmas((prev) => new Map(prev).set(uuid, { ...turma }));
    }
  };

  const removeTurma = (uuid: string) => {
    setSelectedTurmas((prev) => {
      const newMap = new Map(prev);
      newMap.delete(uuid);
      return newMap;
    });
  };

  const setPrioridade = (uuid: string, prioridade: number) => {
    setSelectedTurmas((prev) => {
      const newMap = new Map(prev);
      const turma = newMap.get(uuid);
      if (turma) {
        newMap.set(uuid, { ...turma, prioridade });
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
