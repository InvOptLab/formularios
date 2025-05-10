import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Chip,
  Stack,
  Link,
} from "@mui/material";

interface CardTurmaProps {
  id: string;
  nome: string;
  turma: number;
  horarios: { dia: string; inicio: string; fim: string }[];
  curso: string;
  ementa: string;
  ingles: boolean;
  nivel: string;
  onAdicionar: (key: string, prioridade: number) => void;
  isSelected: boolean;
}

const CardTurma = ({
  id,
  nome,
  turma,
  horarios,
  curso,
  ementa,
  ingles,
  nivel,
  onAdicionar,
  isSelected,
}: CardTurmaProps) => {
  const [prioridade, setPrioridade] = useState<number>(0);

  const handleAdd = () => {
    onAdicionar(id, prioridade);
  };

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "space-around",
        opacity: isSelected ? 0.5 : 1,
        pointerEvents: isSelected ? "none" : "auto",
        height: "100%",
        width: "21em",
      }}
      elevation={3}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignContent: "space-around",
          height: "100%",
        }}
      >
        <Typography variant="h6">{nome}</Typography>
        <Typography variant="h6">(Turma {turma})</Typography>
        <Typography variant="body2" color="text.secondary">
          Curso: {curso}
        </Typography>

        <Box mt={1}>
          <Typography variant="subtitle2">Horários:</Typography>
          <Stack spacing={0.5}>
            {horarios.map((horario, idx) => (
              <Chip
                key={idx}
                label={`${horario.dia}: ${horario.inicio} - ${horario.fim}`}
                size="small"
                color="info"
              />
            ))}
            {horarios.length === 0 && (
              <Chip
                key={id}
                label={`A definir.`}
                size="small"
                color="warning"
              />
            )}
          </Stack>
        </Box>

        <Box mt={1}>
          <Typography variant="body2">
            Ementa:{" "}
            <Link href={ementa} target="_blank" rel="noopener">
              Visualizar
            </Link>
          </Typography>
        </Box>

        <Box mt={1} display="flex" justifyContent="space-around">
          {ingles ? (
            <Chip label="Disciplina em Inglês" color="error" size="small" />
          ) : (
            <Chip
              label="Disciplina em Português"
              color="success"
              size="small"
            />
          )}
          {nivel === "g" ? (
            <Chip label="Graduação" color="primary" size="small" />
          ) : (
            <Chip label="Pós-graduação" color="secondary" size="small" />
          )}
        </Box>

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="end"
          gap={1}
        >
          <TextField
            label="Prioridade"
            type="number"
            size="small"
            value={undefined}
            onChange={(e) => setPrioridade(Number(e.target.value))}
            sx={{ width: 100 }}
          />
          <Button variant="contained" onClick={handleAdd} disabled={isSelected}>
            {isSelected ? "Adicionado" : "Adicionar"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardTurma;
