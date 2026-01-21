"use client";
import { Box, Grid as Grid2, Typography } from "@mui/material";
import CardTurma from "./Selecao/CardTurma";
import CarrinhoItem from "./Selecao/CarrinhoItem";
import { useTurmas } from "../context/TurmasContext";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState, useMemo } from "react";
import { TurmaData } from "../types";
import Filtros, { FilterState } from "./Selecao/Filtros"; // Importar o novo componente

const Selecao = () => {
  const [horariosSelecionados, setHorariosSelecionados] = useState(
    new Set<string>(),
  );

  const { turmas, selectedTurmas, addTurma, removeTurma } = useTurmas();

  // Estado para os filtros
  const [filtros, setFiltros] = useState<FilterState>({
    nome: "",
    curso: "",
    nivel: "",
    noturna: "",
    dia: "",
    horarioInicio: "",
    horarioFim: "",
  });

  useEffect(() => {
    const novosHorarios = new Set<string>();
    for (const turma of selectedTurmas.values()) {
      for (const horario of turma.horarios) {
        novosHorarios.add(`${horario.dia}-${horario.inicio}-${horario.fim}`);
      }
    }
    setHorariosSelecionados(novosHorarios);
  }, [selectedTurmas]);

  // Extrair lista única de cursos para o Select
  const cursosDisponiveis = useMemo(() => {
    const listaCursos = new Set<string>();
    turmas.forEach((t) => {
      // Divide por vírgula se houver múltiplos cursos em uma string, ou adiciona direto
      if (t.curso) {
        // Assume que pode vir separado por vírgula, ex: "Comp, Mat"
        const partes = t.curso.split(",").map((c) => c.trim());
        partes.forEach((p) => listaCursos.add(p));
      }
    });
    return Array.from(listaCursos).sort();
  }, [turmas]);

  // Lógica de Filtragem Principal
  const turmasFiltradas = useMemo(() => {
    return [...turmas.values()].filter((turma) => {
      // 1. Filtro por Nome (insensitivo a maiúsculas/minúsculas)
      if (
        filtros.nome &&
        !turma.nome.toLowerCase().includes(filtros.nome.toLowerCase()) &&
        !turma.codigo.toLowerCase().includes(filtros.nome.toLowerCase()) // Opcional: buscar por código também
      ) {
        return false;
      }

      // 2. Filtro por Curso (contém a string selecionada)
      if (
        filtros.curso &&
        !turma.curso.toLowerCase().includes(filtros.curso.toLowerCase())
      ) {
        return false;
      }

      // 3. Filtro por Nível
      if (filtros.nivel && turma.nivel !== filtros.nivel) {
        return false;
      }

      // 4. Filtro Noturna
      if (filtros.noturna) {
        const isNoturna = filtros.noturna === "sim";
        if (turma.noturna !== isNoturna) {
          return false;
        }
      }

      // 5. Filtros de Horário (Complexo)
      // Se algum filtro de horário estiver ativo, verificamos se ALGUM dos horários da turma bate com a busca
      const temFiltroHorario =
        filtros.dia || filtros.horarioInicio || filtros.horarioFim;

      if (temFiltroHorario) {
        const atendeHorario = turma.horarios.some((h) => {
          // Verifica Dia
          if (filtros.dia && h.dia !== filtros.dia) return false;

          // Verifica Horário Início (h.inicio deve ser >= filtro)
          // Comparação lexicográfica de string "HH:MM" funciona bem
          if (filtros.horarioInicio && h.inicio < filtros.horarioInicio)
            return false;

          // Verifica Horário Fim (h.fim deve ser <= filtro)
          if (filtros.horarioFim && h.fim > filtros.horarioFim) return false;

          return true;
        });

        if (!atendeHorario) return false;
      }

      return true;
    });
  }, [turmas, filtros]);

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
    <Grid2
      container
      spacing={2}
      sx={{ height: "80vh", overflow: "hidden", width: "100%" }}
    >
      {/* Lista de turmas */}
      <Grid2
        size={{ xs: 12, md: 8 }}
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          width: "80vw",
          pr: 2,
          scrollbarWidth: "revert-layer",
          "&::-webkit-scrollbar": { width: "0.4em" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#888" },
          "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
        }}
      >
        <Box flexShrink={0} pr={1}>
          <Typography variant="h4" textAlign="center" marginBottom="0.5em">
            Selecione suas turmas
          </Typography>
          <Filtros
            filtros={filtros}
            onChange={setFiltros}
            setCursosDisponiveis={cursosDisponiveis}
          />
        </Box>

        <Grid2 container spacing={2} justifyContent="center" pb={2}>
          {turmasFiltradas.length > 0 ? (
            turmasFiltradas.map((turma) => (
              <Grid2
                key={`card_selecao_${turma.uuid}`}
                // sm: omitido (herda xs=12) para evitar sobreposição em tablets pequenos
                // md: 6  -> 2 por linha (em vez de 4/3, garantindo espaço para 21em)
                // lg: 4  -> 3 por linha (reduz gaps em monitores comuns)
                // xl: 3  -> 4 por linha (aproveita telas ultrawide/zoom out)
                size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
              >
                <CardTurma
                  key={`${turma.uuid}`}
                  uuid={turma.uuid}
                  nome={turma.nome}
                  turma={turma.turma}
                  horarios={turma.horarios}
                  curso={turma.curso}
                  ementa={turma.ementa}
                  nivel={turma.nivel}
                  onAdicionar={handleAdicionar}
                  isSelected={selectedTurmas.has(turma.uuid)}
                  horariosConflito={horariosSelecionados}
                  noturna={turma.noturna}
                  codigo={turma.codigo}
                  carga={turma.carga}
                  grupo={turma.grupo}
                />
              </Grid2>
            ))
          ) : (
            <Box mt={4} textAlign="center">
              <Typography variant="body1" color="text.secondary">
                Nenhuma turma encontrada com os filtros selecionados.
              </Typography>
            </Box>
          )}
        </Grid2>
      </Grid2>

      {/* Carrinho */}
      <Grid2
        size={{ xs: 12, md: 4 }}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pl: 1,
          borderLeft: { md: "1px solid #e0e0e0" },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Carrinho
        </Typography>

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
              "&::-webkit-scrollbar": { width: "0.4em" },
              "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#888" },
              "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
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
      </Grid2>
    </Grid2>
  );
};

export default Selecao;
