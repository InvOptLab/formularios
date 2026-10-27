import { Stack } from "@mui/material";
import { createContext, JSX, useContext, useState } from "react";

/** Contador incremental para evitar IDs repetidos quando dois alertas são criados no mesmo milissegundo. */
let proximoIdAlerta = 0;
import CustomAlert from "../components/CustomAlert";

export interface Alerta {
  id: number;
  type: "success" | "info" | "warning" | "error";
  message: string;
  closeTime?: number;
  //handleClose?: () => void;
}

interface AlertasInterface {
  alertas: Map<number, Alerta>;
  setAlertas: React.Dispatch<React.SetStateAction<Map<number, Alerta>>>;
}

const AlertsContext = createContext<AlertasInterface>({
  alertas: new Map<number, Alerta>(),
  setAlertas: () => [],
});

export function AlertsWrapper({ children }: { children: React.ReactNode }) {
  const [alertas, setAlertas] = useState<Map<number, Alerta>>(
    new Map<number, Alerta>()
  );
  // {id: 1, message: 'teste 1', type: "info", closeTime: 100}, {id: 2, message: 'teste 2', type: "info", closeTime: 100}

  /**
   * Remove um objeto do state de alertas.
   * @param index Index do objeto dentro do state.
   */
  const removeAlert = (id: number) => {
    setAlertas((prevAlertas) => {
      const newAlerts = new Map(prevAlertas);
      newAlerts.delete(id);
      return newAlerts;
    });
  };

  /**
   * Cria uma lista de alertas que devem ser renderizados
   */
  const renderAlertas = () => {
    const render: JSX.Element[] = [];
    alertas.forEach((alerta, key) => {
      render.push(
        <CustomAlert
          key={key}
          type={alerta.type}
          message={alerta.message}
          id={key}
          closeTime={alerta.closeTime ? alerta.closeTime : 3}
          handleClose={() => removeAlert(key)} // Remove o alerta quando for fechado
        />
      );
    });

    return render;
  };

  return (
    <AlertsContext.Provider
      value={{
        alertas,
        setAlertas,
      }}
    >
      {children}
      <Stack
        position="fixed"
        bottom={{ xs: 80, md: 16 }}
        right={16}
        left={{ xs: 16, sm: "auto" }}
        zIndex={1400}
        spacing={1}
        role="status"
        aria-live="polite"
      >
        {renderAlertas()}
      </Stack>
    </AlertsContext.Provider>
  );
}

export function useAlertsContext() {
  const context = useContext(AlertsContext);

  /**
   * Hook para adicionar um novo alerta no state.
   * @param {string} message Mensagem que será exibida pelo alerta.
   * @param {"success" | "info" | "warning" | "error"} type Tipo da mensagem.
   * @param {number} closeTime: Tempo (em s) para que o alerta seja fechado.
   */
  function addAlerta(
    message: string,
    type: "success" | "info" | "warning" | "error",
    closeTime?: number
  ) {
    context.setAlertas((prevAlertas) => {
      const newAlerts = new Map(prevAlertas);
      // Evita empilhar a mesma mensagem (ex.: vários cliques em "Próximo"):
      // remove a anterior para que a nova reinicie o tempo de exibição.
      for (const [key, alerta] of newAlerts) {
        if (alerta.message === message && alerta.type === type) {
          newAlerts.delete(key);
        }
      }
      // Mantém no máximo 3 alertas visíveis (remove os mais antigos).
      while (newAlerts.size >= 3) {
        newAlerts.delete(newAlerts.keys().next().value as number);
      }
      const id = ++proximoIdAlerta;
      newAlerts.set(id, {
        id,
        message,
        type,
        closeTime,
      });
      return newAlerts;
    });
  }
  return { ...context, addAlerta };
}
