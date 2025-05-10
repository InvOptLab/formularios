"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  // StepIconProps,
} from "@mui/material";
import Introducao from "./components/Introducao";
import Selecao from "./components/Selecao";
import Confirmacao from "./components/Confirmacao";
import Download from "./components/Download";
import Avaliacao from "./components/Avaliacao";
import { useTurmas } from "./context/TurmasContext";
import { useAlertsContext } from "./context/AlertasContext";
import { TurmaData } from "./types";
import { useAvaliacao } from "./context/AvaliacaoContext";
// import CheckIcon from "@mui/icons-material/Check";

// Passos do processo
const steps = [
  "Introdução",
  "Seleção de Turmas",
  "Confirmação de Seleção",
  "Avaliação da Atribuição Anterior",
  "Download do Arquivo",
];

// Ícone customizado para indicar concluído
// const CustomStepIcon = (props: StepIconProps) => {
//   const { active, completed, className } = props;

//   return completed ? (
//     <CheckIcon color="success" />
//   ) : (
//     <div className={className} />
//   );
// };

/**
 * Retorna se o usuário poderá seguir para o step após a Confirmação.
 * @param turmas Turmas Selecionadas
 * @returns {boolean} ´True´ caso possa avançar, `False` caso contrário.
 */
function avancaStepConfirmacao(turmas: TurmaData[]): boolean {
  const prioridadesDefinidas = new Set<number>();
  /**
   * Verifica se todas as turmas apresentam prioridades definidas.
   */
  for (const turma of turmas) {
    if (turma.prioridade === undefined || turma.prioridade === 0) {
      return false;
    }
    prioridadesDefinidas.add(turma.prioridade);
  }

  /**
   * Verifica se as prioridades definidas são diferentes.
   * Caso o Set (que armazena apenas valores diferentes) tiver se tamanho menor que a quantidade total
   * de turmas, isso quer dizer que algum valor foi repetido.
   */
  if (prioridadesDefinidas.size !== turmas.length) {
    return false;
  }

  return true;
}

const StepperFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const { selectedTurmas } = useTurmas();
  const { addAlerta } = useAlertsContext();
  const { avaliacao } = useAvaliacao();

  const totalSteps = () => steps.length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const handleNext = () => {
    /**
     * Não pode haver continuidade do processo caso nas etapas de Seleção e Confirmação não exista nenhuma Turma selecionada.
     * Deve ser barrado em ambos os casos.
     */
    if ([1, 2].includes(activeStep) && selectedTurmas.size === 0) {
      addAlerta(
        "Selecione ao menos uma Turma para que seja possível continuar.",
        "error",
        6
      );
      /**
       * Para ter continuídade no processo de confirmação, nenhuma Turma pode apresentar Prioridade 0 ou repetida.
       */
    } else if (
      activeStep === 2 &&
      !avancaStepConfirmacao(selectedTurmas.values().toArray())
    ) {
      addAlerta(
        "Todas as Turmas devem apresentar Prioridades diferetes de 0 e diferetes entre si.",
        "error",
        6
      );
    } else if (activeStep === 3 && !avaliacao.nota) {
      addAlerta("Uma Nota deve ser selecionada.", "error", 6);
    } else {
      handleComplete();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setCompleted((prev) => {
      const newCompleted = { ...prev };
      const targetStep = activeStep - 1;
      if (targetStep >= 0) {
        delete newCompleted[targetStep];
      }
      return newCompleted;
    });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Introducao />;
      case 1:
        return <Selecao />;
      case 2:
        return <Confirmacao />;
      case 3:
        return <Avaliacao />;
      case 4:
        return <Download />;
      default:
        return <Typography>Passo desconhecido</Typography>;
    }
  };

  return (
    <Box
      sx={{}}
      width="100%"
      display="flex"
      flexDirection="column"
      flexWrap="wrap"
      alignContent="center"
      justifyContent="center"
      alignItems="center"
    >
      <Box width="70%">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>

          <Box sx={{ flex: "1 1 auto" }} />

          <Button
            onClick={handleNext}
            disabled={isLastStep()} //disabled={!completed[activeStep] || isLastStep()}
            variant="contained"
          >
            {isLastStep() ? "Finalizado" : "Próximo"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2, mb: 1 }} display="flex" justifyContent="center">
        {getStepContent(activeStep)}
      </Box>

      {/* <Box sx={{ mt: 2, mb: 1 }} display="flex" justifyContent="flex-end">
        {!completed[activeStep] && (
          <Button onClick={handleComplete} variant="outlined" sx={{ mr: 1 }}>
            Marcar como Concluído
          </Button>
        )}

        {activeStep === totalSteps() - 1 && completed[activeStep] && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Todos os passos foram concluídos ✅
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1 }}>
              Resetar
            </Button>
          </Box>
        )}
      </Box> */}
    </Box>
  );
};

export default StepperFlow;
