"use client";
import React, { useState } from "react";
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
import { TurmaData } from "./Selecao";

const Confirmacao = () => {
  // Mock de dados selecionados (normalmente vem do estado global ou props)
  const [selectedTurmas, setSelectedTurmas] = useState(
    new Map<string, TurmaData>([
      [
        "MAT123,01",
        {
          codigo: "MAT123",
          nome: "Matemática Discreta",
          turma: "01",
          horarios: [
            { dia: "Segunda", inicio: "08:00", fim: "10:00" },
            { dia: "Quarta", inicio: "10:00", fim: "12:00" },
          ],
          curso: "Ciência da Computação",
          ementaUrl: "https://exemplo.com/ementa",
          ingles: false,
          prioridade: 1,
        },
      ],
      [
        "ENG456,02",
        {
          codigo: "ENG456",
          nome: "Engenharia de Software",
          turma: "02",
          horarios: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }],
          curso: "Engenharia de Software",
          ementaUrl: "https://exemplo.com/ementa2",
          ingles: true,
        },
      ],
    ])
  );

  const handlePriorityChange = (codigoTurma: string, newPriority: number) => {
    setSelectedTurmas((prev) => {
      const updated = new Map(prev);
      const turma = updated.get(codigoTurma);
      if (turma) {
        updated.set(codigoTurma, { ...turma, prioridade: newPriority });
      }
      return updated;
    });
  };

  const handleRemove = (codigoTurma: string) => {
    setSelectedTurmas((prev) => {
      const updated = new Map(prev);
      updated.delete(codigoTurma);
      return updated;
    });
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
            <TableCell>Nome</TableCell>
            <TableCell>Turma</TableCell>
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
