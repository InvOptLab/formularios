"use client";
import React from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  DragIndicator,
  VerticalAlignTop,
  Warning,
} from "@mui/icons-material";
import { TurmaData } from "@/app/types";

interface RowTurmaProps {
  turma: TurmaData;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: (idTurma: string) => void;
  conflitos: Map<string, string>;
  /** Estado do arrastar-e-soltar controlado pelo componente pai. */
  arrastando: boolean;
  alvoArraste: boolean;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

/**
 * Item da lista de prioridades. A posição na lista define a prioridade
 * (index + 1). Pode ser reordenado pelas setas, pelo botão "topo" ou
 * arrastando o item.
 */
const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  index,
  total,
  onMove,
  onRemove,
  conflitos,
  arrastando,
  alvoArraste,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  const prioridade = index + 1;
  const temConflito = conflitos.size > 0;

  return (
    <Paper
      variant="outlined"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(index);
      }}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd();
      }}
      onDragEnd={onDragEnd}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 1.5 },
        p: { xs: 1, sm: 1.5 },
        mb: 1,
        borderLeft: 4,
        borderLeftColor: temConflito ? "warning.main" : "primary.light",
        borderTopColor: alvoArraste ? "primary.main" : undefined,
        borderTopWidth: alvoArraste ? 3 : undefined,
        opacity: arrastando ? 0.4 : 1,
        transition: "box-shadow .15s, opacity .15s",
        "&:hover": { boxShadow: 3 },
        "&:hover .drag-handle": { color: "text.primary" },
      }}
    >
      <Box
        className="drag-handle"
        sx={{
          color: "text.disabled",
          cursor: "grab",
          display: { xs: "none", sm: "flex" },
        }}
        aria-hidden
      >
        <DragIndicator />
      </Box>

      {/* Posição = prioridade */}
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          bgcolor: prioridade <= 3 ? "primary.main" : "#e8eef8",
          color: prioridade <= 3 ? "primary.contrastText" : "primary.dark",
        }}
        aria-label={`Prioridade ${prioridade}`}
      >
        {prioridade}º
      </Box>

      {/* Informações da turma */}
      <Box flex={1} minWidth={0}>
        <Typography variant="subtitle1" fontWeight={600} lineHeight={1.3}>
          {turma.nome}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          {turma.codigo} · Turma {turma.turma}
          {turma.curso ? ` · ${turma.curso}` : ""} · Carga{" "}
          {turma.carga.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.75}>
          {turma.horarios.length > 0 ? (
            turma.horarios.map((h, idx) => (
              <Chip
                key={idx}
                size="small"
                variant="outlined"
                label={`${h.dia} ${h.inicio}–${h.fim}`}
              />
            ))
          ) : (
            <Chip size="small" variant="outlined" label="Horário a definir" />
          )}
          {turma.noturna && (
            <Chip
              size="small"
              label="Noturna"
              sx={{ backgroundColor: "#131862", color: "#fff" }}
            />
          )}
          <Chip
            size="small"
            label={turma.nivel === "g" ? "Graduação" : "Pós-graduação"}
            color={turma.nivel === "g" ? "primary" : "secondary"}
            variant="outlined"
          />
          {temConflito && (
            <Tooltip
              title={
                <>
                  Conflita com:
                  {Array.from(conflitos.values()).map((n, i) => (
                    <div key={i}>• {n}</div>
                  ))}
                </>
              }
            >
              <Chip
                size="small"
                color="warning"
                icon={<Warning />}
                label={`Conflito (${conflitos.size})`}
                sx={{ cursor: "help" }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Ações */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        flexShrink={0}
      >
        <Tooltip title="Mover para o topo">
          <span>
            <IconButton
              size="small"
              onClick={() => onMove(index, 0)}
              disabled={index === 0}
              aria-label={`Mover ${turma.nome} para o topo`}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <VerticalAlignTop fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Subir (aumentar prioridade)">
          <span>
            <IconButton
              size="small"
              onClick={() => onMove(index, index - 1)}
              disabled={index === 0}
              aria-label={`Subir ${turma.nome}`}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Descer (diminuir prioridade)">
          <span>
            <IconButton
              size="small"
              onClick={() => onMove(index, index + 1)}
              disabled={index === total - 1}
              aria-label={`Descer ${turma.nome}`}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Remover turma">
          <IconButton
            color="error"
            onClick={() => onRemove(turma.uuid)}
            size="small"
            aria-label={`Remover ${turma.nome}`}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default RowTurma;
