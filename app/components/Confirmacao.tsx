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

  // Ao montar ou alterar a seleção, organizamos a lista inicial
  // respeitando as prioridades que vieram da tela de Seleção.

  useEffect(() => {
    const allTurmas = [...selectedTurmas.values()];
    const total = allTurmas.length;

    // Arrays auxiliares
    const finalArray = new Array(total).fill(null); // Array com "buracos"
    const leftovers: TurmaData[] = []; // Para itens que não cabem na posição desejada

    // Separar quem tem prioridade definida de quem não tem
    const defined = allTurmas
      .filter((t) => t.prioridade && t.prioridade > 0)
      .sort((a, b) => Number(a.prioridade) - Number(b.prioridade)); // Garante ordem numérica (1, 2, 10...)

    const undefineds = allTurmas
      .filter((t) => !t.prioridade || t.prioridade <= 0)
      .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordem alfabética para os sem prioridade

    // Tentar colocar os itens com prioridade na POSIÇÃO exata (Indice = Prioridade - 1)
    defined.forEach((t) => {
      const desiredIndex = Number(t.prioridade) - 1;

      // Se a posição existe e está vazia, ocupa ela
      if (
        desiredIndex >= 0 &&
        desiredIndex < total &&
        finalArray[desiredIndex] === null
      ) {
        finalArray[desiredIndex] = t;
      } else {
        // Se a posição é inválida (ex: Prioridade 10 numa lista de 2) ou já ocupada
        leftovers.push(t);
      }
    });

    // Preencher os buracos vazios com os itens sem prioridade (undefineds)
    // Isso faz com que os itens '0' assumam as posições 1, 2, 3... que não foram ocupadas
    undefineds.forEach((t) => {
      const emptyIndex = finalArray.indexOf(null);
      if (emptyIndex !== -1) {
        finalArray[emptyIndex] = t;
      } else {
        leftovers.push(t); // Segurança
      }
    });

    // Se ainda houver itens (ex: Prioridade 10 numa lista de 2), preencher o que sobrou
    // Eles irão naturalmente para o final da lista, mantendo a ordem relativa
    leftovers.forEach((t) => {
      const emptyIndex = finalArray.indexOf(null);
      if (emptyIndex !== -1) {
        finalArray[emptyIndex] = t;
      }
    });

    // Filtra nulos apenas por segurança e define o estado
    const result = finalArray.filter((t) => t !== null) as TurmaData[];
    setOrderedTurmas(result);

    // Atualiza o contexto global com a nova ordem calculada
    // Assim o botão "Próximo" valida corretamente as prioridades (1, 2, 3...)
    result.forEach((turma, index) => {
      const prioridadeCorreta = index + 1;
      if (turma.prioridade !== prioridadeCorreta) {
        setPrioridade(turma.uuid, prioridadeCorreta);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTurmas.size]);

  // Função para mover itens na lista (Priorização Automática)
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

  const [tutorialDismissed, setTutorialDismissed] = useState(false);

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
              <TableCell width="10%">Prioridade</TableCell>
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
                showTutorial={index === 0 && !tutorialDismissed}
                onDismissTutorial={() => setTutorialDismissed(true)}
                conflitos={getConflitos(turma)}
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
