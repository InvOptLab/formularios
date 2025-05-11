"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import RowTurma from "./Confirmacao/RowTurma";
import { useTurmas } from "../context/TurmasContext";
import { TurmaData } from "../types";

const Confirmacao = () => {
  const { selectedTurmas, setPrioridade, removeTurma } = useTurmas();

  const handlePriorityChange = (idTurma: string, newPriority: number) => {
    setPrioridade(idTurma, newPriority);
  };

  const handleRemove = (idTurma: string) => {
    removeTurma(idTurma);
  };

  /** Implementada também em Seleção */
  const getConflitos = (turma: TurmaData): Map<string, string> => {
    const turmasQueConflita: Map<string, string> = new Map<string, string>();

    for (const selecionada of selectedTurmas.values()) {
      if (turma.conflitos.has(selecionada.id)) {
        turmasQueConflita.set(selecionada.id, selecionada.nome);
      }
    }

    return turmasQueConflita;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "80%",
        maxHeight: "80vh",
        scrollbarWidth: "revert-layer",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      <Typography variant="h4" textAlign="center" p={2}>
        Confirme suas turmas selecionadas
      </Typography>
      <Table
        stickyHeader
        aria-label="Tabela para confirmação de turmas selecionadas."
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Código</TableCell>
            <TableCell>Turma</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Prioridade</TableCell>
            <TableCell>Remover</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...selectedTurmas.entries()].map(([key, turma]) => (
            <RowTurma
              key={key}
              turma={turma}
              onPriorityChange={handlePriorityChange}
              onRemove={handleRemove}
              prioridadesSelecionadas={selectedTurmas
                .values()
                .filter((t) => t.id !== turma.id)
                .map((t) => (t.prioridade ? t.prioridade : 0))
                .toArray()}
              conflitos={getConflitos(turma)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Confirmacao;
