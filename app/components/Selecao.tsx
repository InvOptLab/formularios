import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CardTurma from "./Selecao/CardTurma";
import CarrinhoItem from "./Selecao/CarrinhoItem";

// Tipos
export type Horario = {
  dia: string;
  inicio: string;
  fim: string;
};

export type TurmaData = {
  codigo: string;
  nome: string;
  turma: string;
  horarios: Horario[];
  curso: string;
  ementaUrl: string;
  ingles: boolean;
  prioridade?: number;
};

// Mock das turmas
const mockTurmas = new Map<string, TurmaData>([
  [
    "MAT123,01",
    {
      codigo: "MAT123",
      nome: "Matemática Discreta",
      turma: "01",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "ENG456,02",
    {
      codigo: "ENG456",
      nome: "Engenharia de Software",
      turma: "02",
      horarios: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }],
      curso: "Engenharia de Software",
      ementaUrl: "https://exemplo.com/ementa2",
      ingles: true,
    },
  ],
  [
    "MAT123,06",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "06",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "MAT123,03",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "03",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "MAT123,04",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "04",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "MAT123,05",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "05",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "MAT123,07",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "07",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  [
    "MAT123,08",
    {
      codigo: "MAT123",
      nome: "Modelos de Variáveis Latentes",
      turma: "08",
      horarios: [
        { dia: "Segunda", inicio: "08:00", fim: "10:00" },
        { dia: "Quarta", inicio: "10:00", fim: "12:00" },
      ],
      curso: "Ciência da Computação",
      ementaUrl: "https://exemplo.com/ementa",
      ingles: false,
    },
  ],
  // ... outras turmas
]);

const Selecao = () => {
  const [selectedTurmas, setSelectedTurmas] = useState<Map<string, TurmaData>>(
    new Map()
  );

  const handleAdicionar = (
    codigo: string,
    turma: string,
    prioridade: number
  ) => {
    const key = `${codigo},${turma}`;
    const turmaData = mockTurmas.get(key);
    if (turmaData && !selectedTurmas.has(key)) {
      if (prioridade) {
        turmaData.prioridade = prioridade;
      } else {
        turmaData.prioridade = undefined;
      }
      mockTurmas.set(key, turmaData);
      setSelectedTurmas((prev) => new Map(prev).set(key, turmaData));
    }
  };

  const handleRemover = (key: string) => {
    setSelectedTurmas((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  };

  return (
    <Grid container spacing={1} height="50%">
      {/* Lista de turmas */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h4" textAlign="center">
          Selecione suas turmas
        </Typography>
        {/* <Box
          height="60%"
          overflow="auto"
          sx={{
            scrollbarWidth: "revert-layer",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        > */}
        <Grid container spacing={4} justifyContent="center">
          {[...mockTurmas.values()].map((turma) => (
            <Grid
              key={`card_selecao_${turma.codigo},${turma.turma}}`}
              sx={{ xs: 12, sm: 6 }}
            >
              <CardTurma
                key={`${turma.codigo},${turma.turma}`}
                codigo={turma.codigo}
                nome={turma.nome}
                turma={turma.turma}
                horarios={turma.horarios}
                curso={turma.curso}
                ementaUrl={turma.ementaUrl}
                ingles={turma.ingles}
                onAdicionar={handleAdicionar}
                isSelected={selectedTurmas.has(
                  `${turma.codigo},${turma.turma}`
                )}
              />
            </Grid>
          ))}
        </Grid>
        {/* </Box> */}
      </Grid>

      {/* <Grid size={{ xs: 12, md: 1 }}>
        <span></span>
        <Divider orientation="vertical" />
        <span></span>
      </Grid> */}
      {/* Carrinho */}
      <Grid size={{ xs: 12, md: 4 }} paddingLeft="5px">
        <Typography variant="h6" gutterBottom>
          Carrinho
        </Typography>
        {selectedTurmas.size === 0 ? (
          <Typography variant="body2">Nenhuma turma selecionada.</Typography>
        ) : (
          <Box>
            {[...selectedTurmas.entries()].map(([key, turma]) => (
              <CarrinhoItem
                key={key}
                codigo={turma.codigo}
                turma={turma.turma}
                nome={turma.nome}
                curso={turma.curso}
                prioridade={turma.prioridade}
                onRemover={handleRemover}
              />
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default Selecao;
