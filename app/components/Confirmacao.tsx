"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import RowTurma from "./Confirmacao/RowTurma";
import { useTurmas } from "../context/TurmasContext";
import { TurmaData } from "../types";

const Confirmacao = () => {
  const {
    selectedTurmas,
    setPrioridade,
    removeTurma,
    semNoturnaMinhaArea,
    updateSemNoturnaMinhaArea,
  } = useTurmas();

  // Estado local para controlar a ordem de visualização
  const [orderedTurmas, setOrderedTurmas] = useState<TurmaData[]>([]);

  // 1. Ao montar ou alterar a seleção, organizamos a lista inicial
  // respeitando as prioridades que vieram da tela de Seleção.
  useEffect(() => {
    const sorted = [...selectedTurmas.values()].sort((a, b) => {
      // Se tiver prioridade, usa. Se for 0 ou undefined, joga pro final (Infinity)
      const pA =
        a.prioridade && a.prioridade > 0
          ? a.prioridade
          : Number.MAX_SAFE_INTEGER;
      const pB =
        b.prioridade && b.prioridade > 0
          ? b.prioridade
          : Number.MAX_SAFE_INTEGER;

      if (pA !== pB) return pA - pB;
      // Desempate por nome
      return a.nome.localeCompare(b.nome);
    });

    setOrderedTurmas(sorted);
  }, [selectedTurmas.size]); // Re-executa apenas se o número de turmas mudar (adição/remoção)

  // 2. Função para mover itens na lista (Priorização Automática)
  const moveTurma = (index: number, direction: "up" | "down") => {
    const newOrder = [...orderedTurmas];

    if (direction === "up" && index > 0) {
      // Troca com o anterior
      [newOrder[index], newOrder[index - 1]] = [
        newOrder[index - 1],
        newOrder[index],
      ];
    } else if (direction === "down" && index < newOrder.length - 1) {
      // Troca com o próximo
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
    }

    setOrderedTurmas(newOrder);

    // Atualiza o contexto com as novas prioridades baseadas na nova ordem (1, 2, 3...)
    newOrder.forEach((turma, idx) => {
      const novaPrioridade = idx + 1;
      if (turma.prioridade !== novaPrioridade) {
        setPrioridade(turma.uuid, novaPrioridade);
      }
    });
  };

  const handleRemove = (uuid: string) => {
    removeTurma(uuid);
    // A lista será reordenada pelo useEffect quando o selectedTurmas mudar
  };

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
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <TableContainer
        component={Paper}
        sx={{
          width: "90%",
          maxHeight: "80vh",
          mb: 2,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          p={2}
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          Confirme a ordem de prioridade
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          pb={2}
          color="text.secondary"
        >
          Use as setas para subir ou descer as turmas. A prioridade será
          definida automaticamente pela ordem da lista (1º no topo).
        </Typography>

        <Table stickyHeader aria-label="Tabela de confirmação">
          <TableHead>
            <TableRow>
              <TableCell width="5%" />
              <TableCell width="10%">Prioridade</TableCell>{" "}
              {/* Coluna de Ordem */}
              <TableCell>Código</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell align="center">Mover</TableCell> {/* Controles */}
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderedTurmas.map((turma, index) => (
              <RowTurma
                key={turma.uuid}
                turma={turma}
                index={index}
                total={orderedTurmas.length}
                onMove={moveTurma}
                onRemove={handleRemove}
                isFirst={index === 0} // Para o tutorial
                conflitos={getConflitos(turma)}
                // prioridadesSelecionadas não é mais necessário para validação pois é automático
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!orderedTurmas.some((t) => t.noturna) && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={semNoturnaMinhaArea}
                onChange={updateSemNoturnaMinhaArea}
                name="semNoturnaMinhaArea"
              />
            }
            label="Não há turma noturna para disciplinas de minha área."
          />
        </FormGroup>
      )}
    </Box>
  );
};

export default Confirmacao;
