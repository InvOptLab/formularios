import React from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useAvaliacao } from "../context/AvaliacaoContext";
// import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
// import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
// import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
// import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
// import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const Avaliacao = () => {
  const { avaliacao, updateNota, updateComentario, updatePreferencia } =
    useAvaliacao();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Avaliação da Atribuição Anterior
      </Typography>

      <Typography variant="body1" mb={4} align="justify">
        A seguir estarão presentes alguns campos para que você avalie o quão
        satisfeito ficou com as atribuições que recebeu no semestre atual. Caso
        queira, gostaríamos muito que você apresentasse um comentário sobre o
        motivo da nota selecionada.
      </Typography>

      {/* Componente de Rating */}
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom>
          Sua Nota (1 a 10):
        </Typography>
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          <Rating
            name="avaliacao-nota"
            defaultValue={5}
            value={avaliacao.nota}
            onChange={(_, newValue) => updateNota(newValue)}
            max={10}
          />
          {avaliacao.nota !== null ? (
            <Typography
              variant="body1"
              sx={{ ml: 2 }}
              alignContent="center"
              textAlign="center"
            >
              {avaliacao.nota}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ ml: 2 }} color="error">
              Por favor selecione uma nota.
            </Typography>
          )}
          {/* <Slider
          aria-label="Avaliação"
          defaultValue={3}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={10}
          sx={{ width: "50%" }}
        /> */}
        </Box>
      </Box>

      {/* Comentário */}
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom>
          Detalhe sua nota (opcional):
        </Typography>
        <TextField
          multiline
          fullWidth
          minRows={4}
          value={avaliacao.comentario}
          onChange={(e) => updateComentario(e.target.value)}
          placeholder="Digite aqui o motivo da sua nota..."
          required={false}
        />
      </Box>

      {/* Preferência de distribuição */}
      <Typography variant="body1" mb={2} align="justify">
        A seguir, indique sua preferência em relação à distribuição de horários
        e dias da semana em que você será alocado. Se prefere atribuições
        espalhadas pela semana, mais agrupadas ou se não tem preferência:
      </Typography>

      <RadioGroup
        value={avaliacao.preferencia}
        onChange={(e) =>
          updatePreferencia(
            e.target.value as "Agrupar" | "Espalhar" | "Indiferente"
          )
        }
        sx={{ gap: "2em", justifyContent: "center", flexDirection: "row" }}
      >
        <FormControlLabel value="Agrupar" control={<Radio />} label="Agrupar" />
        <FormControlLabel
          value="Espalhar"
          control={<Radio />}
          label="Espalhar"
        />
        <FormControlLabel
          value="Indiferente"
          control={<Radio />}
          label="Indiferente"
        />
      </RadioGroup>
    </Box>
  );
};

export default Avaliacao;
