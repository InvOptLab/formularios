import { Box, Typography, IconButton, Paper, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface CarrinhoItemProps {
  codigo: string;
  turma: number;
  nome: string;
  curso: string;
  prioridade?: number;
  onRemover: (key: string) => void;
}

const CarrinhoItem = ({
  codigo,
  turma,
  nome,
  curso,
  prioridade,
  onRemover,
}: CarrinhoItemProps) => {
  const key = `${codigo},${turma}`;
  return (
    <Paper
      sx={{
        p: 1,
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        display="flex"
        width="70%"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle2">
            {nome} (Turma {turma})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {curso}
          </Typography>
        </Box>
        <Typography variant="body1" color="textPrimary">
          {prioridade ? prioridade : 0}
        </Typography>
      </Box>
      <Tooltip title="Remover">
        <IconButton onClick={() => onRemover(key)} about="Remover">
          <DeleteIcon color="error" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default CarrinhoItem;
