"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

export interface IAlertProps {
  id: number;
  type: "success" | "info" | "warning" | "error";
  message: string;
  handleClose?: () => void;
  closeTime: number;
}

const titulos: Record<IAlertProps["type"], string> = {
  success: "Tudo certo",
  info: "Informação",
  warning: "Atenção",
  error: "Não foi possível continuar",
};

export default function CustomAlert(props: IAlertProps) {
  const [open, setOpen] = React.useState(true);
  const [pausado, setPausado] = React.useState(false);

  /** Tempo restante (ms); preservado entre pausas. */
  const restanteRef = React.useRef(props.closeTime * 1000);

  /**
   * Fecha o alerta após o tempo definido. Enquanto o mouse está sobre o
   * alerta o tempo fica pausado, para dar tempo de ler mensagens longas.
   * A remoção da fila ocorre em ``onExited``, após a animação.
   */
  React.useEffect(() => {
    if (!open || pausado) return;
    const inicio = Date.now();
    const timer = setTimeout(() => setOpen(false), restanteRef.current);
    return () => {
      clearTimeout(timer);
      restanteRef.current -= Date.now() - inicio;
    };
  }, [open, pausado]);

  return (
    <Box
      sx={{ width: { xs: "100%", sm: "26em" } }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <Collapse in={open} onExited={() => props.handleClose?.()}>
        <Alert
          key={props.id}
          severity={props.type}
          variant="standard"
          sx={{
            position: "relative",
            overflow: "hidden",
            boxShadow: 6,
            border: 1,
            borderColor: `${props.type}.light`,
            alignItems: "flex-start",
          }}
          action={
            <IconButton
              aria-label="Fechar alerta"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
            {titulos[props.type]}
          </AlertTitle>
          {props.message}

          {/* Barra indicando o tempo restante até o fechamento automático */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 3,
              width: "100%",
              bgcolor: `${props.type}.main`,
              transformOrigin: "left",
              animation: `alerta-tempo ${props.closeTime}s linear forwards`,
              animationPlayState: pausado ? "paused" : "running",
              "@keyframes alerta-tempo": {
                from: { transform: "scaleX(1)" },
                to: { transform: "scaleX(0)" },
              },
            }}
          />
        </Alert>
      </Collapse>
    </Box>
  );
}
