"use client";
import { Box, Grid, Typography } from "@mui/material";
import CardTurma from "./Selecao/CardTurma";
import CarrinhoItem from "./Selecao/CarrinhoItem";
import { useTurmas } from "../context/TurmasContext";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { TurmaData } from "../types";

const Selecao = () => {
  // const [selectedTurmas, setSelectedTurmas] = useState<Map<string, TurmaData>>(
  //   new Map()
  // );

  const [horariosSelecionados, setHorariosSelecionados] = useState(
    new Set<string>()
  );

  const { turmas, selectedTurmas, addTurma, removeTurma } = useTurmas();

  useEffect(() => {
    const novosHorarios = new Set<string>();
    for (const turma of selectedTurmas.values()) {
      for (const horario of turma.horarios) {
        novosHorarios.add(`${horario.dia}-${horario.inicio}-${horario.fim}`);
      }
    }
    setHorariosSelecionados(novosHorarios);
  }, [selectedTurmas]);

  const handleAdicionar = (key: string, prioridade: number) => {
    const turmaData = turmas.get(key);
    if (turmaData && !selectedTurmas.has(key)) {
      if (prioridade) {
        turmaData.prioridade = prioridade;
      } else {
        turmaData.prioridade = 0;
      }
      turmas.set(key, turmaData);
      addTurma(key);
    }
  };

  const handleRemover = (key: string) => {
    removeTurma(key);
  };

  /** Implementada também em Seleção */
  const getConflitos = (turma: TurmaData): Map<string, string> => {
    const turmasQueConflita: Map<string, string> = new Map<string, string>();

    for (const selecionada of selectedTurmas.values()) {
      if (turma.conflitos.has(selecionada.id)) {
        turmasQueConflita.set(selecionada.id, selecionada.nome);
      }
    }

    return turmasQueConflita;
  };

  return (
    <Grid container spacing={1} height="50%">
      {/* Lista de turmas */}
      <Grid
        size={{ xs: 12, md: 8 }}
        sx={{
          maxHeight: "80vh", // altura máxima relativa à viewport (ajuste conforme necessário)
          overflowY: "auto",
          pr: 2, // padding-right para evitar que o scroll esconda conteúdo
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
      >
        <Typography variant="h4" textAlign="center" marginBottom="0.5em">
          Selecione suas turmas
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {[...turmas.values()].map((turma) => (
            <Grid key={`card_selecao_${turma.uuid}`} sx={{ xs: 12, sm: 6 }}>
              <CardTurma
                key={`${turma.uuid}`}
                uuid={turma.uuid}
                nome={turma.nome}
                turma={turma.turma}
                horarios={turma.horarios}
                curso={turma.curso}
                ementa={turma.ementa}
                //ingles={turma.ingles ? turma.ingles : false}
                nivel={turma.nivel}
                onAdicionar={handleAdicionar}
                isSelected={selectedTurmas.has(turma.uuid)}
                horariosConflito={horariosSelecionados}
                noturna={turma.noturna}
                codigo={turma.codigo}
                carga={turma.carga}
                grupo={turma.grupo}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      {/* Carrinho */}
      <Grid size={{ xs: 12, md: 4 }} paddingLeft="5px">
        <Typography variant="h6" gutterBottom>
          Carrinho
        </Typography>

        {/* Contadores de seleção */}
        <Box
          mb={2}
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          <Typography variant="body2">
            Turmas selecionadas: <strong>{selectedTurmas.size}</strong> /{" "}
            <strong>10</strong>
          </Typography>
          <Typography variant="body2">
            Turmas noturnas selecionadas:{" "}
            <strong>
              {
                [...selectedTurmas.values()].filter((turma) => turma.noturna)
                  .length
              }
            </strong>{" "}
            / <strong>1</strong>
          </Typography>
        </Box>

        {selectedTurmas.size === 0 ? (
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <WarningIcon color="warning" />
            <Typography variant="body2" color="warning">
              Nenhuma turma selecionada.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              pr: 2,
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
          >
            {[...selectedTurmas.entries()].map(([key, turma]) => (
              <CarrinhoItem
                key={key}
                uuid={turma.uuid}
                turma={turma.turma}
                nome={turma.nome}
                curso={turma.curso}
                prioridade={turma.prioridade}
                onRemover={handleRemover}
                conflitos={getConflitos(turma)}
                noturna={turma.noturna}
                codigo={turma.codigo}
                carga={turma.carga}
              />
            ))}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default Selecao;
