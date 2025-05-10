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

const StepperFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const totalSteps = () => steps.length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

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
    <Box sx={{ width: "100%" }}>
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
          disabled={!completed[activeStep] || isLastStep()}
          variant="contained"
        >
          {isLastStep() ? "Finalizado" : "Próximo"}
        </Button>
      </Box>
      <Box sx={{ mt: 2, mb: 1 }} display="flex" justifyContent="center">
        {getStepContent(activeStep)}
      </Box>

      <Box sx={{ mt: 2, mb: 1 }} display="flex" justifyContent="flex-end">
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
      </Box>
    </Box>
  );
};

export default StepperFlow;
