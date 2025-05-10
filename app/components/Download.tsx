"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useAlertsContext } from "../context/AlertasContext";
import { exportJsonToFile, generateObjectToExport } from "../utils";
import { useTurmas } from "../context/TurmasContext";
import { useAvaliacao } from "../context/AvaliacaoContext";

interface DownloadProps {
  setExportado: Dispatch<SetStateAction<boolean>>;
}

const Download = ({ setExportado }: DownloadProps) => {
  //const [nomeCompleto, setNomeCompleto] = useState("");
  const [erroNome, setErroNome] = useState(false);

  const { addAlerta } = useAlertsContext();

  const { selectedTurmas } = useTurmas();
  const { avaliacao, nome, updateNome } = useAvaliacao();

  const handleExportar = () => {
    // Validação simples: nome e sobrenome (mínimo 2 palavras)
    const partesNome = nome.trim().split(" ");
    if (partesNome.length < 2) {
      setErroNome(true);
      addAlerta("O campo Nome completo deve ser preenchido.", "error", 6);
      return;
    }

    setErroNome(false);

    addAlerta(
      "O arquivo está sendo gerado e será exportado como: " + nome + ".json",
      "info",
      5
    );
    try {
      const objetoParaExportar = generateObjectToExport(
        selectedTurmas.values().toArray(),
        nome,
        avaliacao
      );
      exportJsonToFile(objetoParaExportar, nome);
    } catch (err) {
      addAlerta(
        "Houve um erro ao exportar o arquivo, por favor tente novamente.",
        "error",
        6
      );
      addAlerta("Erro gerado: " + err, "warning", 6);
    }

    setExportado(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Finalização do Processo
      </Typography>
      <Typography variant="body1" gutterBottom align="justify">
        Você chegou ao final do processo! Para exportar os formulários, informe
        seu nome completo (nome e sobrenome). Essa informação será inserida no
        arquivo para facilitar a identificação no processo de atribuição.
      </Typography>

      <TextField
        fullWidth
        label="Nome completo"
        value={nome}
        onChange={(e) => updateNome(e.target.value)}
        margin="normal"
        error={erroNome}
        helperText={erroNome ? "Por favor, informe nome e sobrenome." : ""}
        required
        type="text"
      />

      <Typography variant="body1" gutterBottom mt={2} align="justify">
        Abaixo está o botão para exportar os dados. Lembre-se: os arquivos devem
        ser enviados para o e-mail <strong>formularios@gmail.com</strong>.
      </Typography>

      <Box mt={2} justifyContent="flex-end" display="flex">
        <Button
          variant={
            nome.trim().split(" ").length >= 2 ? "contained" : "outlined"
          }
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportar}
        >
          Exportar
        </Button>
      </Box>
    </Box>
  );
};

export default Download;
