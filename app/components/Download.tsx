"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const Download = () => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [erroNome, setErroNome] = useState(false);

  const handleExportar = () => {
    // Validação simples: nome e sobrenome (mínimo 2 palavras)
    const partesNome = nomeCompleto.trim().split(" ");
    if (partesNome.length < 2) {
      setErroNome(true);
      return;
    }

    setErroNome(false);
    console.log("teste"); // Aqui será a lógica de exportação depois
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Finalização do Processo
      </Typography>
      <Typography variant="body1" gutterBottom>
        Você chegou ao final do processo! Para exportar os formulários, informe
        seu nome completo (nome e sobrenome). Essa informação será inserida no
        arquivo para facilitar a identificação no processo de atribuição.
      </Typography>

      <TextField
        fullWidth
        label="Nome completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        margin="normal"
        error={erroNome}
        helperText={erroNome ? "Por favor, informe nome e sobrenome." : ""}
      />

      <Typography variant="body1" gutterBottom mt={2}>
        Abaixo está o botão para exportar os dados. Lembre-se: os arquivos devem
        ser enviados para o e-mail <strong>formularios@gmail.com</strong>.
      </Typography>

      <Box mt={2} justifyContent="flex-end" display="flex">
        <Button
          variant="contained"
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
