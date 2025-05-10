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

const Confirmacao = () => {
  const { selectedTurmas, setPrioridade, removeTurma } = useTurmas();

  const handlePriorityChange = (idTurma: string, newPriority: number) => {
    setPrioridade(idTurma, newPriority);
  };

  const handleRemove = (idTurma: string) => {
    removeTurma(idTurma);
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" textAlign="center" p={2}>
        Confirme suas turmas selecionadas
      </Typography>
      <Table>
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
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Confirmacao;
