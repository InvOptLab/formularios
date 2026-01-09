"use client";
import React, { useState, useRef, useEffect } from "react"; // Adicionado useRef e useEffect
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
  Popover,
  Button,
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
  isFirst?: boolean;
}

const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  onPriorityChange,
  onRemove,
  prioridadesSelecionadas,
  conflitos,
  isFirst = false,
}) => {
  const [open, setOpen] = useState(false);

  // Estado para o tutorial
  const [tutorialAnchorEl, setTutorialAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  // Referência para o botão de expandir
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  // Abre o tutorial automaticamente se for o primeiro item ao montar o componente
  useEffect(() => {
    if (isFirst && expandButtonRef.current) {
      setTutorialAnchorEl(expandButtonRef.current);
    }
  }, [isFirst]);

  const handleCloseTutorial = () => {
    setTutorialAnchorEl(null);
  };

  const openTutorial = Boolean(tutorialAnchorEl);
  const tutorialId = openTutorial ? "tutorial-popover" : undefined;

  const handlePriorityChange = (
    e: EventTarget & (HTMLInputElement | HTMLTextAreaElement)
  ) => {
    const value = parseInt(e.value, 10);
    onPriorityChange(turma.uuid, isNaN(value) ? 0 : value);
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
              {/* Adicionamos a ref aqui para o Popover saber onde apontar */}
              <IconButton
                size="small"
                onClick={() => setOpen(!open)}
                ref={expandButtonRef}
              >
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

          {/* Componente do Tutorial (Popover) */}
          <Popover
            id={tutorialId}
            open={openTutorial}
            anchorEl={tutorialAnchorEl}
            onClose={handleCloseTutorial}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: { maxWidth: 300, p: 2, backgroundColor: "#e3f2fd" },
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Detalhes e Conflitos
            </Typography>
            <Typography variant="body2" paragraph>
              Aqui você poderá encontrar os detalhes da turma, como também
              problemas que podem estar ocorrendo e, caso exista conflito de
              horário com outra turma selecionada, eles aparecerão aqui.
            </Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button
                size="small"
                onClick={handleCloseTutorial}
                variant="contained"
              >
                Entendi
              </Button>
            </Box>
          </Popover>
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
          <IconButton color="error" onClick={() => onRemove(turma.uuid)}>
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
                      key={turma.uuid}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Typography variant="body2">🕒 A definir.</Typography>
                    </Box>
                  )}
                </Box>

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
              </Box>

              {/* Box de Conflitos */}
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
                        <Typography
                          key={turma.uuid + "_" + key}
                          variant="body2"
                        >
                          - {value[1]}
                        </Typography>
                      ))}
                  </Box>
                </Box>
              )}
              {/* Box de Erros */}
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
