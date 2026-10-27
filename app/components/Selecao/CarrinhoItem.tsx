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
      elevation={0}
      sx={{
        px: 1.5,
        py: 1,
        mb: 1,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: conflitos.size > 0 ? "#fff8e1" : "background.paper",
        border: conflitos.size > 0 ? "1.5px solid #ff9800" : "1px solid #e0e0e0",
      }}
    >
      <Box display="flex" flexDirection="column" flexGrow={1} mr={1} minWidth={0}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="subtitle2" fontWeight={600}>
            {codigo} - {nome}
          </Typography>
          {noturna && (
            <Chip
              label="Noturna"
              sx={{
                fontSize: "0.65rem",
                height: "20px",
                backgroundColor: "#131862",
                color: "#ffffff",
              }}
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" flexWrap="wrap" columnGap={2}>
          <Typography variant="caption" color="text.secondary">
            Turma {turma}
            {curso ? ` - ${curso}` : ""}
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
              backgroundColor: prioridade ? "#e0f7fa" : "#f0f0f0",
              color: prioridade ? "inherit" : "text.secondary",
              px: 1,
              borderRadius: "8px",
            }}
          >
            {prioridade ? `Prioridade: ${prioridade}` : "Sem prioridade"}
          </Typography>
        </Box>

        {conflitos.size > 0 && (
          <Tooltip
            title={
              <>
                {Array.from(conflitos.values()).map((n, i) => (
                  <div key={i}>• {n}</div>
                ))}
              </>
            }
          >
            <Box
              display="flex"
              alignItems="center"
              mt={0.5}
              gap={0.5}
              sx={{ cursor: "help" }}
            >
              <WarningIcon fontSize="small" color="warning" />
              <Typography variant="caption" color="warning.dark" fontWeight={500}>
                Conflito de horário com {conflitos.size} turma
                {conflitos.size > 1 ? "s" : ""}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>

      <Tooltip title="Remover turma">
        <IconButton
          aria-label={`Remover ${nome}`}
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
