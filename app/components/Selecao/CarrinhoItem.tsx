"use client";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

interface CarrinhoItemProps {
  uuid: string;
  codigo: string;
  turma: number;
  nome: string;
  curso: string;
  prioridade?: number;
  onRemover: (key: string) => void;
  conflitos: Map<string, string>;
  noturna: boolean;
  carga: number;
}

const CarrinhoItem = ({
  uuid,
  codigo,
  turma,
  nome,
  curso,
  prioridade,
  onRemover,
  conflitos,
  noturna,
  carga,
}: CarrinhoItemProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        px: 1.5,
        py: 1,
        mb: 1.2,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: conflitos.size > 0 ? "#fff8e1" : "#fdfdfd",
        border: conflitos.size > 0 ? "1.5px solid #ff9800" : "1px solid #eee",
      }}
    >
      <Box display="flex" flexDirection="column" flexGrow={1} mr={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" fontWeight={500}>
            {codigo} - {nome}
          </Typography>
          {noturna && (
            <Chip
              label="Noturna"
              color="default"
              sx={{
                fontSize: "0.65rem",
                height: "20px",
                backgroundColor: "#131862",
                color: "#ffffff",
              }}
            />
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          justifyContent="flex-start"
        >
          <Typography variant="caption" color="text.secondary">
            Turma {turma} - {curso}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Carga:{" "}
            {carga.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              backgroundColor: "#e0f7fa",
              px: 1,
              borderRadius: "8px",
            }}
          >
            Prioridade: {prioridade ?? 0}
          </Typography>
        </Box>

        {conflitos.size > 0 && (
          <Box display="flex" alignItems="center" mt={0.5} gap={0.5}>
            <WarningIcon fontSize="small" color="warning" />
            <Typography variant="caption" color="warning.main" fontWeight={500}>
              Conflito de horário
            </Typography>
          </Box>
        )}
      </Box>

      <Tooltip title="Remover turma">
        <IconButton
          onClick={() => onRemover(uuid)}
          sx={{
            color: "error.main",
            backgroundColor: "#fdecea",
            "&:hover": {
              backgroundColor: "#f9d6d5",
            },
            ml: 1,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default CarrinhoItem;
