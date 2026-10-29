"use client";
import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { NIVEIS } from "../NivelChip";

export interface FilterState {
  nome: string;
  curso: string;
  nivel: string; // 'g', 'p', 'g+p' ou ''
  noturna: string; // 'sim', 'nao' ou ''
  dia: string;
  horarioInicio: string;
  horarioFim: string;
  ocultarConflitos: boolean;
}

export const filtrosVazios: FilterState = {
  nome: "",
  curso: "",
  nivel: "",
  noturna: "",
  dia: "",
  horarioInicio: "",
  horarioFim: "",
  ocultarConflitos: false,
};

interface FiltrosProps {
  filtros: FilterState;
  cursosDisponiveis: string[];
  onChange: (newFilters: FilterState) => void;
  totalEncontrado: number;
  totalGeral: number;
}

const diasSemana = ["Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb.", "Dom."];

const Filtros: React.FC<FiltrosProps> = ({
  filtros,
  cursosDisponiveis,
  onChange,
  totalEncontrado,
  totalGeral,
}) => {
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    onChange({
      ...filtros,
      [name]: value,
    });
  };

  /** Quantidade de filtros avançados ativos (exclui a busca por nome). */
  const filtrosAtivos = (
    Object.keys(filtrosVazios) as (keyof FilterState)[]
  ).filter((k) => k !== "nome" && filtros[k] !== filtrosVazios[k]).length;

  const algumFiltro = filtrosAtivos > 0 || filtros.nome !== "";

  return (
    <Box mb={2} display="flex" flexDirection="column" gap={1.5}>
      <TextField
        fullWidth
        name="nome"
        value={filtros.nome}
        onChange={handleChange}
        placeholder="Buscar por nome ou código da disciplina (inclui código da pós em turmas espelho)…"
        size="small"
        sx={{ bgcolor: "background.paper" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: { "aria-label": "Buscar disciplina" },
        }}
      />

      <Accordion defaultExpanded={false} disableGutters elevation={0} variant="outlined">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterListIcon color="action" />
            <Typography variant="subtitle2">Mais filtros</Typography>
            {filtrosAtivos > 0 && (
              <Chip size="small" color="primary" label={filtrosAtivos} />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Filtro por Curso */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filtro-curso">Curso</InputLabel>
                <Select
                  labelId="filtro-curso"
                  label="Curso"
                  name="curso"
                  value={filtros.curso}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {cursosDisponiveis.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro por Nível */}
            <Grid size={{ xs: 6, sm: 3, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filtro-nivel">Nível</InputLabel>
                <Select
                  labelId="filtro-nivel"
                  label="Nível"
                  name="nivel"
                  value={filtros.nivel}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="g">{NIVEIS.g.rotulo} (inclui espelhos)</MenuItem>
                  <MenuItem value="p">{NIVEIS.p.rotulo} (inclui espelhos)</MenuItem>
                  <MenuItem value="g+p">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: NIVEIS["g+p"].cor,
                        }}
                      />
                      Somente espelhos ({NIVEIS["g+p"].rotuloCurto})
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro Noturna */}
            <Grid size={{ xs: 6, sm: 3, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filtro-noturna">Noturna</InputLabel>
                <Select
                  labelId="filtro-noturna"
                  label="Noturna"
                  name="noturna"
                  value={filtros.noturna}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="sim">Sim</MenuItem>
                  <MenuItem value="nao">Não</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Filtros de Horário */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filtro-dia">Dia da Semana</InputLabel>
                <Select
                  labelId="filtro-dia"
                  label="Dia da Semana"
                  name="dia"
                  value={filtros.dia}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Qualquer dia</em>
                  </MenuItem>
                  {diasSemana.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                fullWidth
                label="Início a partir de"
                name="horarioInicio"
                type="time"
                value={filtros.horarioInicio}
                onChange={handleChange}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                fullWidth
                label="Término até"
                name="horarioFim"
                type="time"
                value={filtros.horarioFim}
                onChange={handleChange}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filtros.ocultarConflitos}
                    onChange={(e) =>
                      onChange({ ...filtros, ocultarConflitos: e.target.checked })
                    }
                  />
                }
                label="Ocultar turmas que conflitam com as já selecionadas"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {totalEncontrado === totalGeral
            ? `${totalGeral} turmas disponíveis`
            : `${totalEncontrado} de ${totalGeral} turmas`}
        </Typography>
        {algumFiltro && (
          <Button size="small" onClick={() => onChange(filtrosVazios)}>
            Limpar filtros
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Filtros;
