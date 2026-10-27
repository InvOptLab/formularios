"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useAlertsContext } from "../context/AlertasContext";
import {
  exportJsonToFile,
  generateObjectToExport,
  nomeCompletoValido,
} from "../utils";
import { useTurmas } from "../context/TurmasContext";
import { useAvaliacao } from "../context/AvaliacaoContext";

const EMAIL_CARGA = "carga-sme@icmc.usp.br";

interface DownloadProps {
  exportado: boolean;
  setExportado: Dispatch<SetStateAction<boolean>>;
}

const Download = ({ exportado, setExportado }: DownloadProps) => {
  const [erroNome, setErroNome] = useState(false);

  const { addAlerta } = useAlertsContext();

  const { selectedTurmas, semNoturnaMinhaArea } = useTurmas();
  const { avaliacao, nome, updateNome } = useAvaliacao();

  const turmasSelecionadas = Array.from(selectedTurmas.values());
  const temNoturna = turmasSelecionadas.some((t) => t.noturna);
  const nomeValido = nomeCompletoValido(nome);
  const nomeArquivo = nome.trim().replace(/\s+/g, " ");

  const handleExportar = () => {
    // Validação simples: nome e sobrenome (mínimo 2 palavras)
    if (!nomeValido) {
      setErroNome(true);
      addAlerta("O campo Nome completo deve ser preenchido.", "error", 6);
      return;
    }

    setErroNome(false);

    try {
      const objetoParaExportar = generateObjectToExport(
        turmasSelecionadas,
        nomeArquivo,
        avaliacao,
        // A opção só vale quando de fato não há turma noturna selecionada
        semNoturnaMinhaArea && !temNoturna
      );
      exportJsonToFile(objetoParaExportar, nomeArquivo);
      addAlerta(
        `Arquivo exportado como "${nomeArquivo}.json". Lembre-se de enviá-lo por e-mail.`,
        "success",
        6
      );
      setExportado(true);
    } catch (err) {
      addAlerta(
        "Houve um erro ao exportar o arquivo, por favor tente novamente. Erro: " +
          err,
        "error",
        8
      );
    }
  };

  return (
    <Paper variant="outlined" sx={{ maxWidth: 720, mx: "auto", p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Finalização do Processo
      </Typography>
      <Typography variant="body1" gutterBottom align="justify">
        Você chegou ao final do processo! Para exportar os formulários, informe
        seu nome completo (nome e sobrenome). Essa informação será inserida no
        arquivo para facilitar a identificação no processo de atribuição.
      </Typography>

      {/* Resumo do que será exportado */}
      <Paper variant="outlined" sx={{ p: 2, my: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Resumo
        </Typography>
        <Box display="flex" flexWrap="wrap" columnGap={3} rowGap={0.5}>
          <Typography variant="body2">
            Turmas: <strong>{turmasSelecionadas.length}</strong>
          </Typography>
          <Typography variant="body2">
            Noturnas:{" "}
            <strong>{turmasSelecionadas.filter((t) => t.noturna).length}</strong>
          </Typography>
          <Typography variant="body2">
            Nota: <strong>{avaliacao.nota ?? "—"}</strong>
          </Typography>
          <Typography variant="body2">
            Preferência: <strong>{avaliacao.preferencia}</strong>
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary">
          1ª prioridade:{" "}
          {turmasSelecionadas.find((t) => t.prioridade === 1)?.nome ?? "—"}
        </Typography>
      </Paper>

      <TextField
        fullWidth
        label="Nome completo"
        value={nome}
        onChange={(e) => {
          updateNome(e.target.value);
          if (erroNome && nomeCompletoValido(e.target.value)) setErroNome(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleExportar();
        }}
        margin="normal"
        error={erroNome}
        helperText={
          erroNome
            ? "Por favor, informe nome e sobrenome."
            : nomeValido
            ? `O arquivo será salvo como "${nomeArquivo}.json".`
            : " "
        }
        required
        autoComplete="name"
        type="text"
      />

      <Box mt={1} justifyContent="flex-end" display="flex">
        <Button
          variant={nomeValido ? "contained" : "outlined"}
          color="primary"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleExportar}
        >
          {exportado ? "Exportar novamente" : "Exportar"}
        </Button>
      </Box>

      <Alert severity={exportado ? "success" : "info"} sx={{ mt: 3 }}>
        {exportado ? (
          <>
            Arquivo exportado! Agora envie-o para{" "}
            <a href={`mailto:${EMAIL_CARGA}`}>
              <strong>{EMAIL_CARGA}</strong>
            </a>{" "}
            e clique em <strong>Finalizar</strong>.
          </>
        ) : (
          <>
            Após exportar, o arquivo deve ser enviado para o e-mail{" "}
            <a href={`mailto:${EMAIL_CARGA}`}>
              <strong>{EMAIL_CARGA}</strong>
            </a>
            .
          </>
        )}
      </Alert>
    </Paper>
  );
};

export default Download;
