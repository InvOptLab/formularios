import { Box, Grid, Typography } from "@mui/material";
import CardTurma from "./Selecao/CardTurma";
import CarrinhoItem from "./Selecao/CarrinhoItem";
import { useTurmas } from "../context/TurmasContext";

const Selecao = () => {
  // const [selectedTurmas, setSelectedTurmas] = useState<Map<string, TurmaData>>(
  //   new Map()
  // );

  const { turmas, selectedTurmas, addTurma, removeTurma } = useTurmas();

  const handleAdicionar = (key: string, prioridade: number) => {
    const turmaData = turmas.get(key);
    if (turmaData && !selectedTurmas.has(key)) {
      if (prioridade) {
        turmaData.prioridade = prioridade;
      } else {
        turmaData.prioridade = undefined;
      }
      turmas.set(key, turmaData);
      addTurma(key);
    }
  };

  const handleRemover = (key: string) => {
    removeTurma(key);
  };

  return (
    <Grid container spacing={1} height="50%">
      {/* Lista de turmas */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h4" textAlign="center" marginBottom="0.5em">
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
        <Grid container spacing={2} justifyContent="center">
          {[...turmas.values()].map((turma) => (
            <Grid
              key={`card_selecao_${turma.codigo},${turma.turma}}`}
              sx={{ xs: 12, sm: 6 }}
            >
              <CardTurma
                key={`${turma.codigo},${turma.turma}`}
                id={turma.id}
                nome={turma.nome}
                turma={turma.turma}
                horarios={turma.horarios}
                curso={turma.curso}
                ementa={turma.ementa}
                ingles={turma.ingles ? turma.ingles : false}
                nivel={turma.nivel}
                onAdicionar={handleAdicionar}
                isSelected={selectedTurmas.has(turma.id)}
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
