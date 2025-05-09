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
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
} from "@mui/icons-material";
import { TurmaData } from "../Selecao";

interface RowTurmaProps {
  turma: TurmaData;
  onPriorityChange: (codigoTurma: string, newPriority: number) => void;
  onRemove: (codigoTurma: string) => void;
}

const RowTurma: React.FC<RowTurmaProps> = ({
  turma,
  onPriorityChange,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);

  const handlePriorityChange = (
    e: EventTarget & (HTMLInputElement | HTMLTextAreaElement)
  ) => {
    const value = parseInt(e.value, 10);
    onPriorityChange(
      `${turma.codigo},${turma.turma}`,
      isNaN(value) ? 0 : value
    );
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{turma.codigo}</TableCell>
        <TableCell>{turma.nome}</TableCell>
        <TableCell>{turma.turma}</TableCell>
        <TableCell>
          <TextField
            type="number"
            value={turma.prioridade ? turma.prioridade : 0}
            onChange={(e) => handlePriorityChange(e.target)}
            size="small"
            sx={{ width: "80px" }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            color="error"
            onClick={() => onRemove(`${turma.codigo},${turma.turma}`)}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              margin={2}
              p={2}
              borderLeft="4px solid #1976d2"
              bgcolor="#f5f5f5"
              borderRadius={2}
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
              </Box>

              <Box mt={2} display="flex" alignItems="center" gap={1}>
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
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowTurma;
