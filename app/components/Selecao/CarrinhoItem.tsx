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
  id: string;
  codigo: string;
  turma: number;
  nome: string;
  curso: string;
  prioridade?: number;
  onRemover: (key: string) => void;
  conflitos: Map<string, string>;
  noturna: boolean;
}

// const CarrinhoItem = ({
//   id,
//   codigo,
//   turma,
//   nome,
//   curso,
//   prioridade,
//   onRemover,
//   conflitos,
//   noturna,
// }: CarrinhoItemProps) => {
//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 2,
//         mb: 2,
//         borderRadius: 2,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         backgroundColor: conflitos.size > 0 ? "#fff3e0" : "#fafafa",
//         border: conflitos.size > 0 ? "2px solid #ff9800" : "none",
//       }}
//     >
//       <Box display="flex" flexDirection="column" width="75%">
//         <Typography variant="subtitle1" fontWeight={600}>
//           {nome}{" "}
//           <Typography variant="caption" component="span">
//             (Turma {turma})
//           </Typography>
//         </Typography>

//         <Typography variant="body2" color="text.secondary" mt={0.5}>
//           {curso}
//         </Typography>

//         {conflitos.size > 0 && (
//           <Box mt={1} display="flex" alignItems="center" gap={1}>
//             <WarningIcon fontSize="small" color="warning" />
//             <Typography variant="body2" color="warning.main">
//               Conflito de horário com outras turmas selecionadas
//             </Typography>
//           </Box>
//         )}

//         <Box mt={1}>
//           <Typography variant="caption" color="text.secondary">
//             Prioridade:
//           </Typography>
//           <Typography
//             variant="body1"
//             component="span"
//             sx={{
//               ml: 1,
//               fontWeight: 500,
//               backgroundColor: "#e0f7fa",
//               px: 1.5,
//               py: 0.3,
//               borderRadius: "12px",
//               display: "inline-block",
//             }}
//           >
//             {prioridade ?? 0}
//           </Typography>
//         </Box>
//       </Box>

//       <Tooltip title="Remover turma do carrinho">
//         <IconButton
//           onClick={() => onRemover(id)}
//           sx={{
//             color: "error.main",
//             backgroundColor: "#fdecea",
//             "&:hover": {
//               backgroundColor: "#f9d6d5",
//             },
//           }}
//         >
//           <DeleteIcon />
//         </IconButton>
//       </Tooltip>
//     </Paper>
//   );
// };

const CarrinhoItem = ({
  id,
  codigo,
  turma,
  nome,
  curso,
  prioridade,
  onRemover,
  conflitos,
  noturna,
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
          onClick={() => onRemover(id)}
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
