"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  DragIndicator,
  VerticalAlignTop,
} from "@mui/icons-material";
import RowTurma from "./Confirmacao/RowTurma";
import { useTurmas } from "../context/TurmasContext";
import { useAlertsContext } from "../context/AlertasContext";
import { TurmaData } from "../types";
import { getConflitos, MIN_TURMAS } from "../utils";

const Confirmacao = () => {
  const {
    selectedTurmas,
    setPrioridade,
    removeTurma,
    semNoturnaMinhaArea,
    updateSemNoturnaMinhaArea,
  } = useTurmas();
  const { addAlerta } = useAlertsContext();

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

  /** Atualiza a ordem local e grava as prioridades (1, 2, 3...) no contexto. */
  const aplicarOrdem = (newOrder: TurmaData[]) => {
    setOrderedTurmas(newOrder);
    newOrder.forEach((turma, idx) => {
      const novaPrioridade = idx + 1;
      if (turma.prioridade !== novaPrioridade) {
        setPrioridade(turma.uuid, novaPrioridade);
      }
    });
  };

  // Move um item da posição `from` para `to` (Priorização Automática)
  const moveTurma = (from: number, to: number) => {
    if (from === to || to < 0 || to >= orderedTurmas.length) return;
    const newOrder = [...orderedTurmas];
    const [item] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, item);
    aplicarOrdem(newOrder);
  };

  const handleRemove = (uuid: string) => {
    // Renumera as prioridades antes de remover, para que o recálculo feito
    // pelo useEffect mantenha a ordem atual (sem "buracos" na numeração).
    const turma = orderedTurmas.find((t) => t.uuid === uuid);
    aplicarOrdem(orderedTurmas.filter((t) => t.uuid !== uuid));
    removeTurma(uuid);
    if (turma) {
      addAlerta(`"${turma.nome}" foi removida da sua lista.`, "info", 4);
    }
  };

  // Estado do arrastar-e-soltar
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const finalizarArraste = () => {
    if (dragIndex !== null && overIndex !== null) {
      moveTurma(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const conflitosPorTurma = new Map(
    orderedTurmas.map((t) => [t.uuid, getConflitos(t, selectedTurmas.values())])
  );
  const qtdConflitos = [...conflitosPorTurma.values()].filter(
    (c) => c.size > 0
  ).length;
  const qtdNoturnas = orderedTurmas.filter((t) => t.noturna).length;
  const abaixoDoMinimo = orderedTurmas.length < MIN_TURMAS;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        height: { md: "100%" },
        minHeight: 0,
      }}
    >
      {/* Lista ordenável */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box flexShrink={0} mb={1.5}>
          <Typography variant="h5" fontWeight={700}>
            Confirme a ordem de prioridade
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O topo da lista é a sua maior preferência. Reordene com as setas,
            com o botão de topo ou arrastando os itens.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: { md: "auto" },
            pr: { md: 1 },
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {orderedTurmas.map((turma, index) => (
            <RowTurma
              key={turma.uuid}
              turma={turma}
              index={index}
              total={orderedTurmas.length}
              onMove={moveTurma}
              onRemove={handleRemove}
              conflitos={conflitosPorTurma.get(turma.uuid) ?? new Map()}
              arrastando={dragIndex === index}
              alvoArraste={
                dragIndex !== null && overIndex === index && dragIndex !== index
              }
              onDragStart={setDragIndex}
              onDragEnter={setOverIndex}
              onDragEnd={finalizarArraste}
            />
          ))}
          {orderedTurmas.length === 0 && (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Nenhuma turma selecionada. Volte ao passo anterior.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Painel lateral de resumo */}
      <Paper
        variant="outlined"
        sx={{
          width: { xs: "100%", md: 340, lg: 360 },
          flexShrink: 0,
          height: { md: "100%" },
          overflowY: { md: "auto" },
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Resumo
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
          {[
            {
              rotulo: "Turmas",
              valor: orderedTurmas.length,
              cor: abaixoDoMinimo ? "error.main" : "success.main",
            },
            {
              rotulo: "Noturnas",
              valor: qtdNoturnas,
              cor: qtdNoturnas > 0 ? "success.main" : "warning.main",
            },
            {
              rotulo: "Conflitos",
              valor: qtdConflitos,
              cor: qtdConflitos > 0 ? "warning.main" : "success.main",
            },
          ].map((e) => (
            <Box
              key={e.rotulo}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                py: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700} color={e.cor}>
                {e.valor}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {e.rotulo}
              </Typography>
            </Box>
          ))}
        </Box>

        {abaixoDoMinimo && (
          <Alert severity="error">
            Você precisa de ao menos {MIN_TURMAS} turmas. Volte ao passo
            anterior para adicionar mais {MIN_TURMAS - orderedTurmas.length}.
          </Alert>
        )}

        {qtdConflitos > 0 && (
          <Alert severity="warning">
            <AlertTitle>Conflitos de horário</AlertTitle>
            {qtdConflitos} turma{qtdConflitos > 1 ? "s têm" : " tem"} conflito
            com outras da lista. Isso é permitido, mas considere ao ordenar as
            prioridades. Passe o mouse sobre o selo laranja para ver detalhes.
          </Alert>
        )}

        {qtdNoturnas === 0 && orderedTurmas.length > 0 && (
          <Alert severity={semNoturnaMinhaArea ? "success" : "warning"}>
            <AlertTitle>Nenhuma turma noturna</AlertTitle>
            Volte ao passo anterior para adicionar uma, ou confirme abaixo caso
            não exista turma noturna na sua área.
            <FormControlLabel
              sx={{ display: "flex", mt: 1 }}
              control={
                <Checkbox
                  checked={semNoturnaMinhaArea}
                  onChange={updateSemNoturnaMinhaArea}
                  name="semNoturnaMinhaArea"
                  size="small"
                />
              }
              label="Não há turma noturna para disciplinas de minha área."
            />
          </Alert>
        )}

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Como ordenar
          </Typography>
          <Box
            component="ul"
            sx={{ pl: 2.5, m: 0, color: "text.secondary", typography: "body2" }}
          >
            <li>
              <ArrowUpward sx={{ fontSize: 14, verticalAlign: "middle" }} />{" "}
              <ArrowDownward sx={{ fontSize: 14, verticalAlign: "middle" }} />{" "}
              sobem ou descem uma posição;
            </li>
            <li>
              <VerticalAlignTop sx={{ fontSize: 14, verticalAlign: "middle" }} />{" "}
              leva a turma direto para o 1º lugar;
            </li>
            <li>
              <DragIndicator sx={{ fontSize: 14, verticalAlign: "middle" }} />{" "}
              arraste o item para qualquer posição.
            </li>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Confirmacao;
