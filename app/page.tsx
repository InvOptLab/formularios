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
 * @param step Passo em que o usuário se encontra. Será utilizado para não aplicar determinadas verificações no step de seleção.
 * Utilizado também para generalizar a função.
 * @returns {boolean} ´True´ caso possa avançar, `False` caso contrário.
 */
function avancaStepConfirmacao(
  turmas: TurmaData[],
  step: number
): {
  podeContinuar: boolean;
  mensagem: string;
} {
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
  }

  /**
   * Deve ter ao menos uma noturna Selecionada
   */

  if (!turmas.some((turma) => turma.noturna)) {
    return {
      podeContinuar: false,
      mensagem: "Ao menos uma turma Noturna deve ser Selecionada.",
    };
  }

  if (turmas.length < 10) {
    return {
      podeContinuar: false,
      mensagem: "Ao menos 10 turmas devem ser selecionadas.",
    };
  }

  return { podeContinuar: true, mensagem: "" };
}

const StepperFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const [exportado, setExportado] = useState(false);

  const { selectedTurmas } = useTurmas();
  const { addAlerta } = useAlertsContext();
  const { avaliacao } = useAvaliacao();

  const totalSteps = () => steps.length;

  const isLastStep = () => activeStep === totalSteps() - 1;
  const isFinalizado = () => activeStep === totalSteps();

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
    } else if (activeStep === 1) {
      const { podeContinuar, mensagem } = avancaStepConfirmacao(
        selectedTurmas.values().toArray(),
        1
      );
      if (!podeContinuar) {
        addAlerta(mensagem, "error", 6);
      } else {
        handleComplete();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 2) {
      const { podeContinuar, mensagem } = avancaStepConfirmacao(
        selectedTurmas.values().toArray(),
        2
      );
      if (!podeContinuar) {
        addAlerta(mensagem, "error", 6);
      } else {
        handleComplete();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 3 && !avaliacao.nota) {
      addAlerta("Uma Nota deve ser selecionada.", "error", 6);
    } else if (activeStep === 4 && !exportado) {
      addAlerta(
        "Para poder continuar o arquivo deve ser exportado.",
        "warning",
        6
      );
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
        return <Download setExportado={setExportado} />;
      case 5:
        return (
          <Box
            sx={{ mt: 4, textAlign: "center" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="30%"
            gap={2}
          >
            <Typography variant="h5" gutterBottom>
              ✅ Todos os passos foram concluídos!
            </Typography>

            <Typography variant="body1" align="justify">
              Agradecemos por ter preenchido os formulários. Sabemos que nem
              sempre é possível atender todas as expectativas, mas estamos
              continuamente trabalhando para aprimorar as plataformas e tornar o
              processo cada vez mais justo, simples e eficiente. Seu feedback é
              essencial nessa jornada.
            </Typography>

            {/* <Button variant="outlined" onClick={handleReset}>
              Resetar Processo
            </Button> */}
          </Box>
        );
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
            disabled={isFinalizado()} //disabled={!completed[activeStep] || isLastStep()}
            variant={activeStep === 4 && !exportado ? "outlined" : "contained"}
          >
            {isLastStep() ? "Finalizar" : "Próximo"}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ mt: 2, mb: 1 }}
        display="flex"
        justifyContent="center"
        width="100%"
      >
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
