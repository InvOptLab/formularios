"use client";
import React from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import NightlightIcon from "@mui/icons-material/Nightlight";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CardTurma from "./Selecao/CardTurma";
import CarrinhoItem from "./Selecao/CarrinhoItem";
import { useTurmas } from "../context/TurmasContext";
import WarningIcon from "@mui/icons-material/Warning";
import { useState, useMemo } from "react";
import Filtros, { FilterState, filtrosVazios } from "./Selecao/Filtros";
import {
  getConflitos,
  horariosSobrepoem,
  MIN_TURMAS,
  normalizarTexto,
} from "../utils";

const scrollbarSx = {
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": { width: "0.4em" },
  "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
  "&::-webkit-scrollbar-thumb": { backgroundColor: "#888" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
} as const;

const Selecao = () => {
  const { turmas, selectedTurmas, addTurma, removeTurma } = useTurmas();

  // Estado para os filtros
  const [filtros, setFiltros] = useState<FilterState>(filtrosVazios);

  // Extrair lista única de cursos para o Select
  const cursosDisponiveis = useMemo(() => {
    const listaCursos = new Set<string>();
    turmas.forEach((t) => {
      // Divide por vírgula se houver múltiplos cursos em uma string, ou adiciona direto
      if (t.curso) {
        const partes = t.curso.split(",").map((c) => c.trim());
        partes.forEach((p) => p && listaCursos.add(p));
      }
    });
    return Array.from(listaCursos).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [turmas]);

  // Lógica de Filtragem Principal
  const turmasFiltradas = useMemo(() => {
    const busca = normalizarTexto(filtros.nome.trim());

    return [...turmas.values()]
      .filter((turma) => {
        // 1. Filtro por Nome ou Código (sem diferenciar maiúsculas e acentos)
        if (
          busca &&
          !normalizarTexto(turma.nome).includes(busca) &&
          !normalizarTexto(turma.codigo).includes(busca)
        ) {
          return false;
        }

        // 2. Filtro por Curso (correspondência exata entre os cursos da turma)
        if (
          filtros.curso &&
          !turma.curso
            .split(",")
            .map((c) => c.trim())
            .includes(filtros.curso)
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

        // 5. Ocultar turmas que conflitam com as já selecionadas
        if (
          filtros.ocultarConflitos &&
          !selectedTurmas.has(turma.uuid) &&
          getConflitos(turma, selectedTurmas.values()).size > 0
        ) {
          return false;
        }

        // 6. Filtros de Horário
        // Se algum filtro de horário estiver ativo, verificamos se ALGUM dos horários da turma bate com a busca
        const temFiltroHorario =
          filtros.dia || filtros.horarioInicio || filtros.horarioFim;

        if (temFiltroHorario) {
          const atendeHorario = turma.horarios.some((h) => {
            if (filtros.dia && h.dia !== filtros.dia) return false;
            // Comparação lexicográfica de string "HH:MM" funciona bem
            if (filtros.horarioInicio && h.inicio < filtros.horarioInicio)
              return false;
            if (filtros.horarioFim && h.fim > filtros.horarioFim) return false;
            return true;
          });

          if (!atendeHorario) return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          a.codigo.localeCompare(b.codigo, "pt-BR") || a.turma - b.turma
      );
  }, [turmas, filtros, selectedTurmas]);

  /**
   * Para cada turma, índices dos horários que se sobrepõem a algum horário
   * de outra turma já selecionada.
   */
  const horariosSelecionados = useMemo(
    () =>
      Array.from(selectedTurmas.values()).flatMap((t) =>
        t.horarios.map((h) => ({ uuid: t.uuid, horario: h }))
      ),
    [selectedTurmas]
  );

  const getHorariosEmConflito = (uuid: string): Set<number> => {
    const turma = turmas.get(uuid);
    const indices = new Set<number>();
    turma?.horarios.forEach((h, idx) => {
      if (
        horariosSelecionados.some(
          (s) => s.uuid !== uuid && horariosSobrepoem(h, s.horario)
        )
      ) {
        indices.add(idx);
      }
    });
    return indices;
  };

  const handleAdicionar = (key: string, prioridade: number) => {
    addTurma(key, prioridade);
  };

  const handleRemover = (key: string) => {
    removeTurma(key);
  };

  const selecionadas = Array.from(selectedTurmas.values());
  const qtdNoturnas = selecionadas.filter((turma) => turma.noturna).length;
  const qtdConflitos = selecionadas.filter(
    (t) => getConflitos(t, selecionadas).size > 0
  ).length;
  const cargaTotal = selecionadas.reduce((acc, t) => acc + t.carga, 0);
  const minimoAtingido = selectedTurmas.size >= MIN_TURMAS;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        height: { md: "100%" },
        minHeight: 0,
      }}
    >
      {/* Lista de turmas: cabeçalho + filtros fixos, apenas os cards rolam */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box
          flexShrink={0}
          pb={0.5}
        >
          <Box display="flex" alignItems="baseline" flexWrap="wrap" columnGap={2}>
            <Typography variant="h5" fontWeight={700}>
              Selecione suas turmas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mínimo de {MIN_TURMAS} turmas, sendo ao menos uma noturna. A
              prioridade é opcional aqui.
            </Typography>
          </Box>
          <Box mt={1.5}>
            <Filtros
              filtros={filtros}
              onChange={setFiltros}
              cursosDisponiveis={cursosDisponiveis}
              totalEncontrado={turmasFiltradas.length}
              totalGeral={turmas.size}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: { md: "auto" },
            pr: { md: 1 },
            pb: 2,
            ...scrollbarSx,
          }}
        >
          {turmasFiltradas.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                // Cards com largura mínima confortável: a quantidade por linha
                // se adapta ao espaço disponível em vez de espremer o conteúdo.
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
              }}
            >
              {turmasFiltradas.map((turma) => (
                <CardTurma
                  key={`card_selecao_${turma.uuid}`}
                  uuid={turma.uuid}
                  nome={turma.nome}
                  turma={turma.turma}
                  horarios={turma.horarios}
                  curso={turma.curso}
                  ementa={turma.ementa}
                  nivel={turma.nivel}
                  onAdicionar={handleAdicionar}
                  onRemover={handleRemover}
                  isSelected={selectedTurmas.has(turma.uuid)}
                  horariosEmConflito={getHorariosEmConflito(turma.uuid)}
                  conflitos={getConflitos(turma, selectedTurmas.values())}
                  noturna={turma.noturna}
                  codigo={turma.codigo}
                  carga={turma.carga}
                  grupo={turma.grupo}
                />
              ))}
            </Box>
          ) : (
            <Paper variant="outlined" sx={{ mt: 2, p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma turma encontrada com os filtros selecionados.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Painel lateral: resumo + turmas selecionadas */}
      <Paper
        variant="outlined"
        sx={{
          width: { xs: "100%", md: 340, lg: 380 },
          flexShrink: 0,
          height: { md: "100%" },
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Box p={2} pb={1.5} borderBottom={1} borderColor="divider">
          <Typography variant="h6" fontWeight={700} mb={1.5}>
            Turmas selecionadas
          </Typography>

          <Box mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Progresso do mínimo
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                color={minimoAtingido ? "success.main" : "text.primary"}
              >
                {selectedTurmas.size} / {MIN_TURMAS}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (selectedTurmas.size / MIN_TURMAS) * 100)}
              color={minimoAtingido ? "success" : "primary"}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
            <Estatistica
              rotulo="Noturnas"
              valor={qtdNoturnas}
              ok={qtdNoturnas >= 1}
              icone={<NightlightIcon fontSize="small" />}
              dica={
                qtdNoturnas >= 1
                  ? "Requisito de turma noturna atendido."
                  : "Selecione ao menos uma turma noturna."
              }
            />
            <Estatistica
              rotulo="Conflitos"
              valor={qtdConflitos}
              ok={qtdConflitos === 0}
              icone={<WarningIcon fontSize="small" />}
              dica="Turmas selecionadas com conflito de horário entre si."
            />
            <Estatistica
              rotulo="Carga"
              valor={cargaTotal.toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
              })}
              icone={<ScheduleIcon fontSize="small" />}
              dica="Soma da carga das turmas selecionadas."
            />
          </Box>
        </Box>

        {selectedTurmas.size === 0 ? (
          <Box
            p={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            color="text.secondary"
            textAlign="center"
          >
            <PlaylistAddIcon sx={{ fontSize: 40, opacity: 0.6 }} />
            <Typography variant="body2">
              Nenhuma turma selecionada ainda. Use o botão{" "}
              <strong>Adicionar</strong> nos cards ao lado.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: { md: "auto" },
              p: 1.5,
              ...scrollbarSx,
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
                conflitos={getConflitos(turma, selectedTurmas.values())}
                noturna={turma.noturna}
                codigo={turma.codigo}
                carga={turma.carga}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

interface EstatisticaProps {
  rotulo: string;
  valor: React.ReactNode;
  ok?: boolean;
  icone: React.ReactNode;
  dica: string;
}

/** Pequeno bloco de indicador usado no resumo da seleção. */
const Estatistica = ({ rotulo, valor, ok, icone, dica }: EstatisticaProps) => {
  const cor =
    ok === undefined ? "text.secondary" : ok ? "success.main" : "warning.main";
  return (
    <Tooltip title={dica}>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          px: 1,
          py: 0.75,
          textAlign: "center",
          cursor: "help",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
          color={cor}
        >
          {icone}
          <Typography variant="h6" fontWeight={700} lineHeight={1.2} color="text.primary">
            {valor}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {rotulo}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default Selecao;
