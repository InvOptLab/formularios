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
  isFirst?: boolean;
}

const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  index,
  total,
  onMove,
  onRemove,
  conflitos,
  isFirst = false,
}) => {
  const [open, setOpen] = useState(false);
  const [tutorialAnchorEl, setTutorialAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isFirst && expandButtonRef.current) {
      setTutorialAnchorEl(expandButtonRef.current);
    }
  }, [isFirst]);

  const handleCloseTutorial = () => {
    setTutorialAnchorEl(null);
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
          >
            <Box p={2} maxWidth={300} bgcolor="#e3f2fd">
              <Typography variant="subtitle2" fontWeight="bold">
                Detalhes
              </Typography>
              <Typography variant="body2">
                Aqui você vê detalhes e conflitos.
              </Typography>
              <Button size="small" onClick={handleCloseTutorial}>
                Entendi
              </Button>
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
            <Box margin={1}>
              {/* Recoloque aqui o conteúdo detalhado da turma (Horários, etc.) 
                   exatamente como estava no seu arquivo original ou na versão anterior.
                   A lógica de exibição de conflitos permanece a mesma.
                */}
              <Box
                p={2}
                bgcolor="#f5f5f5"
                borderRadius={2}
                display="flex"
                gap={2}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Horários:
                  </Typography>
                  {turma.horarios.map((h, i) => (
                    <Typography key={i} variant="caption" display="block">
                      {h.dia}: {h.inicio}-{h.fim}
                    </Typography>
                  ))}
                </Box>
                {conflitos.size > 0 && (
                  <Box color="warning.main">
                    <Typography variant="subtitle2" fontWeight="bold">
                      ⚠️ Conflitos:
                    </Typography>
                    {[...conflitos.values()].map((c, i) => (
                      <Typography key={i} variant="caption" display="block">
                        - {c}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowTurma;
