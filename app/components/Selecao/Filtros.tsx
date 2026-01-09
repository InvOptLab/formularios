"use client";
import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
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

export interface FilterState {
  nome: string;
  curso: string;
  nivel: string; // 'p', 'g' ou ''
  noturna: string; // 'sim', 'nao' ou ''
  dia: string;
  horarioInicio: string;
  horarioFim: string;
}

interface FiltrosProps {
  filtros: FilterState;
  setCursosDisponiveis: string[];
  onChange: (newFilters: FilterState) => void;
}

const diasSemana = ["Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb.", "Dom."];

const Filtros: React.FC<FiltrosProps> = ({
  filtros,
  setCursosDisponiveis,
  onChange,
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

  return (
    <Box mb={2}>
      <Accordion defaultExpanded={false} disableGutters elevation={1}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterListIcon color="action" />
            <Typography variant="subtitle1">Filtros de Pesquisa</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Filtro por Nome */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Nome da Disciplina"
                name="nome"
                value={filtros.nome}
                onChange={handleChange}
                placeholder="Ex: Cálculo"
                size="small"
              />
            </Grid>

            {/* Filtro por Curso */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Curso</InputLabel>
                <Select
                  label="Curso"
                  name="curso"
                  value={filtros.curso}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {setCursosDisponiveis.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro por Nível */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Nível</InputLabel>
                <Select
                  label="Nível"
                  name="nivel"
                  value={filtros.nivel}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="g">Graduação</MenuItem>
                  <MenuItem value="p">Pós-Graduação</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro Noturna */}
            <Grid size={{ xs: 6, sm: 3, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Noturna</InputLabel>
                <Select
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
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                Filtros de Horário (Dia e Intervalo):
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Dia da Semana</InputLabel>
                    <Select
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
                    label="Início Mínimo"
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
                    label="Término Máximo"
                    name="horarioFim"
                    type="time"
                    value={filtros.horarioFim}
                    onChange={handleChange}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Filtros;
