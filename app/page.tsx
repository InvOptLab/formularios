"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MobileStepper,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Introducao from "./components/Introducao";
import Selecao from "./components/Selecao";
import Confirmacao from "./components/Confirmacao";
import Download from "./components/Download";
import Avaliacao from "./components/Avaliacao";
import { useTurmas } from "./context/TurmasContext";
import { useAlertsContext } from "./context/AlertasContext";
import { TurmaData } from "./types";
import { useAvaliacao } from "./context/AvaliacaoContext";
import { MIN_TURMAS } from "./utils";

// Passos do processo
const steps = [
  "Introdução",
  "Seleção de Turmas",
  "Confirmação de Seleção",
  "Avaliação da Atribuição Anterior",
  "Download do Arquivo",
];

/**
 * Retorna se o usuário poderá seguir para o step após a Confirmação.
 * @param turmas Turmas Selecionadas
 * @param step Passo em que o usuário se encontra. Será utilizado para não aplicar determinadas verificações no step de seleção.
 * Utilizado também para generalizar a função.
 * @returns {boolean} ´True´ caso possa avançar, `False` caso contrário.
 */
function avancaStepConfirmacao(
  turmas: TurmaData[],
  step: number,
  semNoturnaMinhaArea: boolean
): {
  podeContinuar: boolean;
  mensagem: string;
} {
  if (turmas.length < MIN_TURMAS) {
    return {
      podeContinuar: false,
      mensagem: `Ao menos ${MIN_TURMAS} turmas devem ser selecionadas (atualmente: ${turmas.length}).`,
    };
  }

  if (step === 2) {
    const prioridadesDefinidas = new Set<number>();
    /**
     * Verifica se todas as turmas apresentam prioridades definidas.
     */
    for (const turma of turmas) {
      if (turma.prioridade === undefined || turma.prioridade <= 0) {
        return {
          podeContinuar: false,
          mensagem:
            "Todas as Turmas devem apresentar Prioridades maiores que 0.",
        };
      }
      prioridadesDefinidas.add(turma.prioridade);
    }

    /**
     * Verifica se as prioridades definidas são diferentes.
     * Caso o Set (que armazena apenas valores diferentes) tiver se tamanho menor que a quantidade total
     * de turmas, isso quer dizer que algum valor foi repetido.
     */
    if (prioridadesDefinidas.size !== turmas.length) {
      return {
        podeContinuar: false,
        mensagem:
          "Todas as Turmas devem apresentar prioridades diferentes entre si.",
      };
    }

    /**
     * Deve ter ao menos uma noturna Selecionada
     */
    if (!turmas.some((turma) => turma.noturna) && !semNoturnaMinhaArea) {
      return {
        podeContinuar: false,
        mensagem:
          "Selecione ao menos uma turma noturna ou marque a opção indicando que não há turma noturna na sua área.",
      };
    }
  }

  return { podeContinuar: true, mensagem: "" };
}

const StepperFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [exportado, setExportado] = useState(false);

  const { selectedTurmas, semNoturnaMinhaArea } = useTurmas();
  const { addAlerta } = useAlertsContext();
  const { avaliacao } = useAvaliacao();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;
  const isFinalizado = activeStep === totalSteps;

  /**
   * Todo o preenchimento fica apenas em memória. Avisa o usuário antes de
   * fechar/recarregar a aba caso existam dados não exportados.
   */
  useEffect(() => {
    if (selectedTurmas.size === 0 || exportado) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [selectedTurmas.size, exportado]);

  /** Ao trocar de passo, volta ao topo da página. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const avancar = () => setActiveStep((prev) => prev + 1);

  const handleNext = () => {
    if (activeStep === 1 || activeStep === 2) {
      const { podeContinuar, mensagem } = avancaStepConfirmacao(
        Array.from(selectedTurmas.values()),
        activeStep,
        semNoturnaMinhaArea
      );
      if (!podeContinuar) {
        addAlerta(mensagem, "error", 6);
        return;
      }
    } else if (activeStep === 3 && !avaliacao.nota) {
      addAlerta("Uma Nota deve ser selecionada.", "error", 6);
      return;
    } else if (activeStep === 4 && !exportado) {
      addAlerta(
        "Para poder continuar o arquivo deve ser exportado.",
        "warning",
        6
      );
      return;
    }
    avancar();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**
   * Em telas médias/grandes o conteúdo ocupa exatamente a altura disponível;
   * etapas com layout próprio (Introdução, Seleção e Confirmação) controlam a
   * própria rolagem, as demais rolam dentro deste wrapper.
   */
  const comRolagem = (conteudo: React.ReactNode) => (
    <Box sx={{ height: { md: "100%" }, overflowY: { md: "auto" }, pr: { md: 1 } }}>
      {conteudo}
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Introducao />;
      case 1:
        return <Selecao />;
      case 2:
        return <Confirmacao />;
      case 3:
        return comRolagem(<Avaliacao />);
      case 4:
        return comRolagem(
          <Download exportado={exportado} setExportado={setExportado} />
        );
      case 5:
        return comRolagem(
          <Box
            sx={{ mt: 4, textAlign: "center", maxWidth: 560, mx: "auto" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64 }} />
            <Typography variant="h5" gutterBottom>
              Todos os passos foram concluídos!
            </Typography>

            <Typography variant="body1" align="justify">
              Agradecemos por ter preenchido os formulários. Sabemos que nem
              sempre é possível atender todas as expectativas, mas estamos
              continuamente trabalhando para aprimorar as plataformas e tornar o
              processo cada vez mais justo, simples e eficiente. Seu feedback é
              essencial nessa jornada.
            </Typography>

            <Typography variant="body1" align="justify">
              Não se esqueça de enviar o arquivo exportado para{" "}
              <a href="mailto:carga-sme@icmc.usp.br">
                <strong>carga-sme@icmc.usp.br</strong>
              </a>
              .
            </Typography>
          </Box>
        );
      default:
        return <Typography>Passo desconhecido</Typography>;
    }
  };

  const botaoVoltar = (
    <Button
      variant="outlined"
      disabled={activeStep === 0}
      onClick={handleBack}
      startIcon={<ArrowBackIcon />}
    >
      Voltar
    </Button>
  );

  const botaoProximo = (
    <Button
      onClick={handleNext}
      disabled={isFinalizado}
      variant={activeStep === 4 && !exportado ? "outlined" : "contained"}
      endIcon={isLastStep ? undefined : <ArrowForwardIcon />}
    >
      {isLastStep ? "Finalizar" : "Próximo"}
    </Button>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ minHeight: "100vh", height: { md: "100dvh" } }}
    >
      {/* Cabeçalho com o progresso do processo (fixo no topo) */}
      <Paper
        square
        elevation={2}
        sx={{ position: "sticky", top: 0, zIndex: 1100, px: 2, py: 1.5 }}
      >
        <Container maxWidth="xl" disableGutters>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="primary"
            textAlign={{ xs: "center", md: "left" }}
            mb={1}
          >
            Formulário de Atribuição de Disciplinas — SME/ICMC
          </Typography>

          {isMobile ? (
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Passo {Math.min(activeStep + 1, totalSteps)} de {totalSteps}
                {activeStep < totalSteps && <>: <strong>{steps[activeStep]}</strong></>}
              </Typography>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {botaoVoltar}
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{ flex: 1 }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {botaoProximo}
            </Box>
          )}
        </Container>
      </Paper>

      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          py: 2,
          pb: isMobile ? 10 : 2,
          overflow: { md: "hidden" },
        }}
      >
        {getStepContent(activeStep)}
      </Container>

      {/* Navegação inferior em telas pequenas */}
      {isMobile && (
        <Paper
          square
          elevation={8}
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
        >
          <MobileStepper
            variant="dots"
            steps={totalSteps}
            position="static"
            activeStep={Math.min(activeStep, totalSteps - 1)}
            backButton={botaoVoltar}
            nextButton={botaoProximo}
          />
        </Paper>
      )}
    </Box>
  );
};

export default StepperFlow;
