"use client";
import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  TextField,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
} from "@mui/icons-material";
import { TurmaData } from "@/app/types";

interface RowTurmaProps {
  turma: TurmaData;
  onPriorityChange: (idTurma: string, newPriority: number) => void;
  onRemove: (idTurma: string) => void;
  prioridadesSelecionadas: number[];
  conflitos: Map<string, string>;
}

const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  onPriorityChange,
  onRemove,
  prioridadesSelecionadas,
  conflitos,
}) => {
  const [open, setOpen] = useState(false);

  const handlePriorityChange = (
    e: EventTarget & (HTMLInputElement | HTMLTextAreaElement)
  ) => {
    const value = parseInt(e.value, 10);
    onPriorityChange(turma.id, isNaN(value) ? 0 : value);
  };

  const hasError =
    !turma.prioridade ||
    turma.prioridade <= 0 ||
    prioridadesSelecionadas.includes(turma.prioridade);

  const errorMessage =
    !turma.prioridade || turma.prioridade <= 0
      ? "A prioridade deve ser maior que 0."
      : prioridadesSelecionadas.includes(turma.prioridade)
      ? "Esta prioridade já foi selecionada para outra turma."
      : "";

  return (
    <>
      <TableRow>
        <TableCell>
          <Badge
            color={
              errorMessage ? "error" : conflitos.size > 0 ? "warning" : "info"
            }
            anchorOrigin={{ horizontal: "left" }}
            variant="dot"
            invisible={!errorMessage && conflitos.size === 0}
          >
            <Tooltip title="Expandir">
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? (
                  <KeyboardArrowUp
                    sx={{
                      color: hasError
                        ? "error.main"
                        : conflitos.size > 0
                        ? "warning.main"
                        : "inherit",
                    }}
                  />
                ) : (
                  <KeyboardArrowDown
                    sx={{
                      color: hasError
                        ? "error.main"
                        : conflitos.size > 0
                        ? "warning.main"
                        : "inherit",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Badge>
        </TableCell>
        <TableCell>{turma.codigo}</TableCell>
        <TableCell>{turma.grupo}</TableCell>
        <TableCell>{turma.turma}</TableCell>
        <TableCell>{turma.curso}</TableCell>
        <TableCell sx={{ textOverflow: "ellipsis" }}>{turma.nome}</TableCell>
        <TableCell>
          <TextField
            type="number"
            value={turma.prioridade ? turma.prioridade : 0}
            onChange={(e) => handlePriorityChange(e.target)}
            size="small"
            sx={{ width: "80px" }}
            error={hasError}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </TableCell>
        <TableCell>
          <IconButton color="error" onClick={() => onRemove(turma.id)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              <Box
                margin={2}
                p={2}
                borderLeft="4px solid #1976d2"
                bgcolor="#f5f5f5"
                borderRadius={2}
                width="20%"
              >
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Horários:
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {turma.horarios.map((h, idx) => (
                    <Box key={idx} display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">
                        🕒 {`${h.dia}: ${h.inicio} - ${h.fim}`}
                      </Typography>
                    </Box>
                  ))}
                  {turma.horarios.length === 0 && (
                    <Box
                      key={turma.id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Typography variant="body2">🕒 A definir.</Typography>
                    </Box>
                  )}
                </Box>

                {/* <Box mt={2} display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="bold">
                    Disciplina em inglês:
                  </Typography>
                  <Typography
                    variant="body2"
                    color={turma.ingles ? "success.main" : "text.secondary"}
                    fontWeight="medium"
                  >
                    {turma.ingles ? "Sim ✅" : "Não"}
                  </Typography>
                </Box> */}

                <Box mt={2} display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="bold">
                    Carga:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {" "}
                    {turma.carga.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>

                {turma.noturna && (
                  <Box mt={2} display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      🌙 Turma Noturna
                    </Typography>
                  </Box>
                )}

                {/* {turma.grupo && (
                  <>
                    {" "}
                    <Typography variant="body2" fontWeight="bold">
                      Grupo:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {turma.grupo}
                    </Typography>
                  </>
                )} */}
              </Box>

              {conflitos.size > 0 && (
                <Box
                  margin={2}
                  p={2}
                  borderLeft="4px solid #ed6c02"
                  bgcolor="#f5f5f5"
                  borderRadius={2}
                  width="auto"
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    ⚠️🕒 Conflitos de horários
                  </Typography>
                  <Box>
                    {conflitos
                      .entries()
                      .toArray()
                      .map((value, key) => (
                        <Typography key={turma.id + "_" + key} variant="body2">
                          - {value[1]}
                        </Typography>
                      ))}
                  </Box>
                </Box>
              )}
              {hasError && (
                <Box
                  margin={2}
                  p={2}
                  borderLeft="4px solid rgb(210, 25, 25)"
                  bgcolor="#f5f5f5"
                  borderRadius={2}
                  width="auto"
                >
                  <Typography variant="body2" color="error.main">
                    ⚠️ {errorMessage}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowTurma;
