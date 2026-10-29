"use client";
import { ReactNode } from "react";
import { Alert, Avatar, Box, Paper, Typography } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import StarRateIcon from "@mui/icons-material/StarRate";
import DownloadIcon from "@mui/icons-material/Download";
import { MIN_TURMAS } from "../utils";

interface EtapaProps {
  numero: number;
  titulo: string;
  icone: ReactNode;
  children: ReactNode;
  importante: ReactNode;
}

/** Bloco de descrição de uma etapa do processo. */
const Etapa = ({ numero, titulo, icone, children, importante }: EtapaProps) => (
  <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", gap: 2 }}>
    <Avatar
      sx={{
        bgcolor: "primary.main",
        width: 44,
        height: 44,
        display: { xs: "none", sm: "flex" },
      }}
    >
      {icone}
    </Avatar>
    <Box flex={1} minWidth={0}>
      <Typography variant="overline" color="primary" lineHeight={1.5}>
        Etapa {numero}
      </Typography>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1.5}>
        {children}
      </Typography>
      <Box
        sx={{
          bgcolor: "#f0f6ff",
          borderLeft: 3,
          borderColor: "primary.main",
          borderRadius: 1,
          px: 1.5,
          py: 1,
        }}
      >
        <Typography variant="body2">
          <strong>Importante:</strong> {importante}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const Introducao = () => {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        maxWidth: 900,
        mx: "auto",
        height: { md: "100%" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho fixo do componente */}
      <Box px={{ xs: 2, sm: 3 }} pt={3} pb={2} borderBottom={1} borderColor="divider">
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Bem-vindo à Plataforma de Preenchimento de Formulários
        </Typography>
        <Typography variant="body1" color="text.secondary">
          O processo tem quatro etapas e leva poucos minutos. Clique em{" "}
          <strong>Próximo</strong> para começar.
        </Typography>
      </Box>

      {/* Apenas o conteúdo rola */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: { md: "auto" },
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Alert severity="warning" variant="outlined">
          Seus dados ficam apenas neste navegador até a exportação. Não feche
          nem recarregue a página antes de baixar o arquivo.
        </Alert>

        <Etapa
          numero={1}
          titulo="Seleção de Turmas"
          icone={<ChecklistIcon />}
          importante={
            <>
              para prosseguir, ao menos {MIN_TURMAS} turmas devem ser
              selecionadas, sendo ao menos uma noturna (salvo se não houver
              turma noturna na sua área).
            </>
          }
        >
          O processo inicia com a seleção das turmas de interesse, apresentadas
          como itens de uma loja: escolha as turmas e adicione-as à sua lista.
          Use a busca e os filtros para encontrar disciplinas por nome, curso,
          nível ou horário. Conflitos de horário com turmas já escolhidas são
          sinalizados em laranja. Se quiser, já é possível indicar uma
          prioridade ao adicionar — ela poderá ser revista no passo seguinte.
          Turmas <strong>espelho</strong> (selo verde <em>Graduação + Pós</em>)
          são oferecidas simultaneamente na graduação e na pós e aparecem uma
          única vez, com o código da graduação e carga 1,5.
        </Etapa>

        <Etapa
          numero={2}
          titulo="Confirmação e Ordem de Prioridade"
          icone={<SwapVertIcon />}
          importante={
            <>
              a ordem da lista define a prioridade (1, 2, 3…), sem repetições.
              Como de costume, a comissão interpreta um valor de prioridade
              baixo como elevada preferência pela disciplina.
            </>
          }
        >
          Revise as turmas escolhidas e organize-as da mais desejada (topo) para
          a menos desejada, usando as setas ou arrastando os itens. Horários e
          conflitos de cada turma ficam visíveis na própria lista. Caso nenhuma
          turma noturna tenha sido selecionada, será necessário confirmar que
          não há turma noturna na sua área.
        </Etapa>

        <Etapa
          numero={3}
          titulo="Avaliação da Atribuição Anterior"
          icone={<StarRateIcon />}
          importante="a única exigência obrigatória é a atribuição de uma nota."
        >
          Um pequeno formulário com três campos nos ajuda a entender onde e
          como podemos melhorar. As respostas são usadas como feedback para
          refinar continuamente o processo de atribuição.
        </Etapa>

        <Etapa
          numero={4}
          titulo="Download do Arquivo"
          icone={<DownloadIcon />}
          importante={
            <>
              informe seu nome completo, exporte o arquivo e envie-o para{" "}
              <a href="mailto:carga-sme@icmc.usp.br">carga-sme@icmc.usp.br</a>.
            </>
          }
        >
          No último passo você baixa o arquivo finalizado, que deverá ser
          enviado à comissão responsável pelo processo de atribuição.
        </Etapa>
      </Box>
    </Paper>
  );
};

export default Introducao;
