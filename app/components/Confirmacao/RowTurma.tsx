"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Badge,
  Tooltip,
  Popover,
  Button,
  Chip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { TurmaData } from "@/app/types";

interface RowTurmaProps {
  turma: TurmaData;
  index: number;
  total: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onRemove: (idTurma: string) => void;
  conflitos: Map<string, string>;
  showTutorial?: boolean;
  onDismissTutorial?: () => void;
}

const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  index,
  total,
  onMove,
  onRemove,
  conflitos,
  showTutorial = false,
  onDismissTutorial,
}) => {
  const [open, setOpen] = useState(false);
  const [tutorialAnchorEl, setTutorialAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showTutorial && expandButtonRef.current) {
      setTutorialAnchorEl(expandButtonRef.current);
    } else {
      setTutorialAnchorEl(null); // Fecha se o pai disser que não deve mostrar
    }
  }, [showTutorial]);

  const handleCloseTutorial = () => {
    setTutorialAnchorEl(null);
    // Avisa o pai que o usuário fechou/dispensou
    if (onDismissTutorial) onDismissTutorial();
  };

  const openTutorial = Boolean(tutorialAnchorEl);

  // A prioridade agora é calculada visualmente com base no índice
  const prioridadeExibida = index + 1;

  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: open ? "#f9f9f9" : "inherit",
        }}
      >
        <TableCell>
          <Badge
            color={conflitos.size > 0 ? "warning" : "info"}
            anchorOrigin={{ horizontal: "left" }}
            variant="dot"
            invisible={conflitos.size === 0}
          >
            <Tooltip title="Ver detalhes">
              <IconButton
                size="small"
                onClick={() => setOpen(!open)}
                ref={expandButtonRef}
              >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Tooltip>
          </Badge>

          {/* Tutorial Popover (mantido da versão anterior) */}
          <Popover
            open={openTutorial}
            anchorEl={tutorialAnchorEl}
            onClose={handleCloseTutorial}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            disableRestoreFocus // Opcional: melhora usabilidade ao fechar
          >
            <Box p={2} maxWidth={320} bgcolor="#e3f2fd">
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Detalhes da Turma
              </Typography>
              <Typography variant="body2" paragraph>
                Clique nesta seta para expandir. Você poderá ver os
                <strong> horários</strong>, a <strong>carga horária</strong> e
                verificar se existem <strong>conflitos</strong> com outras
                disciplinas.
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCloseTutorial}
                  sx={{ textTransform: "none" }}
                >
                  Entendi
                </Button>
              </Box>
            </Box>
          </Popover>
        </TableCell>

        {/* Coluna de Prioridade Automática */}
        <TableCell>
          <Chip
            label={`${prioridadeExibida}º`}
            color="primary"
            variant={prioridadeExibida === 1 ? "filled" : "outlined"}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </TableCell>

        <TableCell>{turma.codigo}</TableCell>
        <TableCell>{turma.turma}</TableCell>
        <TableCell>{turma.nome}</TableCell>

        {/* Controles de Ordenação */}
        <TableCell align="center">
          <Box display="flex" justifyContent="center">
            <IconButton
              size="small"
              onClick={() => onMove(index, "up")}
              disabled={index === 0}
              title="Aumentar prioridade (Subir)"
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onMove(index, "down")}
              disabled={index === total - 1}
              title="Diminuir prioridade (Descer)"
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>

        <TableCell align="center">
          <IconButton
            color="error"
            onClick={() => onRemove(turma.uuid)}
            size="small"
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowTurma;
