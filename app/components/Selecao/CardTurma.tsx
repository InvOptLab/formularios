"use client";
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
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Horario, Nivel, TurmaEspelho } from "@/app/types";
import NivelChip from "../NivelChip";

interface CardTurmaProps {
  uuid: string;
  nome: string;
  turma: number;
  horarios: Horario[];
  curso: string;
  ementa: string;
  nivel: Nivel;
  espelho?: TurmaEspelho;
  onAdicionar: (key: string, prioridade: number) => void;
  onRemover: (key: string) => void;
  isSelected: boolean;
  /** Índices dos horários desta turma que se sobrepõem a turmas já selecionadas. */
  horariosEmConflito: Set<number>;
  /** Nomes das turmas selecionadas com as quais esta turma conflita. */
  conflitos: Map<string, string>;
  noturna: boolean;
  codigo: string;
  grupo?: string;
  carga: number;
}

const CardTurma = ({
  uuid,
  nome,
  turma,
  horarios,
  curso,
  ementa,
  nivel,
  espelho,
  onAdicionar,
  onRemover,
  isSelected,
  horariosEmConflito,
  conflitos,
  noturna,
  codigo,
  grupo,
  carga,
}: CardTurmaProps) => {
  const [prioridade, setPrioridade] = useState<string>("");

  const prioridadeNumero = Number(prioridade);
  const prioridadeInvalida =
    prioridade !== "" &&
    (!Number.isInteger(prioridadeNumero) || prioridadeNumero < 1);

  const handleAdd = () => {
    onAdicionar(uuid, prioridadeInvalida ? 0 : prioridadeNumero);
    setPrioridade("");
  };

  const temConflito = !isSelected && conflitos.size > 0;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: 4,
        borderColor: isSelected
          ? "success.main"
          : temConflito
          ? "warning.main"
          : "transparent",
        bgcolor: isSelected ? "#f3faf3" : "background.paper",
        transition: "border-color .2s, box-shadow .2s",
        "&:hover": { boxShadow: 6 },
      }}
      elevation={2}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            {codigo} · Turma {turma}
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Carga:{" "}
            {carga.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>

        <Typography variant="h6" lineHeight={1.25}>
          {nome}
        </Typography>
        {curso && (
          <Typography variant="body2" color="text.secondary">
            Curso: {curso}
          </Typography>
        )}

        <Box display="flex" flexWrap="wrap" gap={0.5}>
          <NivelChip nivel={nivel} />
          {noturna && (
            <Chip
              label="Noturna"
              sx={{ backgroundColor: "#131862", color: "#ffffff" }}
              size="small"
            />
          )}
          {grupo && (
            <Chip
              label={grupo}
              sx={{ backgroundColor: "#853C00", color: "#ffffff" }}
              size="small"
            />
          )}
        </Box>

        {espelho && (
          <Box
            sx={{
              bgcolor: "#e0f2f1",
              borderLeft: 3,
              borderColor: "#00796b",
              borderRadius: 1,
              px: 1.25,
              py: 0.75,
            }}
          >
            <Typography variant="caption" component="div" fontWeight={600}>
              Turma espelho com a pós-graduação
            </Typography>
            <Typography variant="caption" component="div" color="text.secondary">
              {espelho.codigo} · {espelho.nome} ·{" "}
              <Link href={espelho.ementa} target="_blank" rel="noopener noreferrer">
                ementa
              </Link>
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2">Horários:</Typography>
          <Stack spacing={0.5} mt={0.5}>
            {horarios.map((horario, idx) => {
              const conflita = !isSelected && horariosEmConflito.has(idx);
              return (
                <Chip
                  key={idx}
                  label={`${horario.dia} ${horario.inicio} – ${horario.fim}${
                    conflita ? " (conflito)" : ""
                  }`}
                  size="small"
                  variant={conflita ? "filled" : "outlined"}
                  color={conflita ? "warning" : "default"}
                />
              );
            })}
            {horarios.length === 0 && (
              <Chip label="A definir" size="small" variant="outlined" />
            )}
          </Stack>
        </Box>

        {temConflito && (
          <Tooltip
            title={
              <>
                Conflita com:
                {Array.from(conflitos.values()).map((n, i) => (
                  <div key={i}>• {n}</div>
                ))}
              </>
            }
          >
            <Typography
              variant="caption"
              color="warning.dark"
              fontWeight={600}
              sx={{ cursor: "help" }}
            >
              ⚠ Conflita com {conflitos.size} turma
              {conflitos.size > 1 ? "s" : ""} selecionada
              {conflitos.size > 1 ? "s" : ""}
            </Typography>
          </Tooltip>
        )}

        <Link
          href={ementa}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
        >
          Ver ementa <OpenInNewIcon sx={{ fontSize: 14 }} />
        </Link>

        <Box
          mt="auto"
          pt={1}
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-end"
          gap={1}
        >
          {isSelected ? (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => onRemover(uuid)}
              sx={{
                "&:hover": {
                  color: "error.main",
                  borderColor: "error.main",
                },
              }}
              aria-label={`Remover ${nome} da seleção`}
            >
              Adicionada · remover
            </Button>
          ) : (
            <>
              <TextField
                label="Prioridade"
                placeholder="Opcional"
                type="number"
                size="small"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                error={prioridadeInvalida}
                helperText={prioridadeInvalida ? "Inteiro ≥ 1" : undefined}
                sx={{ width: 120 }}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
              <Button
                variant="contained"
                onClick={handleAdd}
                startIcon={<AddIcon />}
                sx={{ height: 40 }}
              >
                Adicionar
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardTurma;
