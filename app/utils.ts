import { AvaliacaoData, TurmaData } from "./types";

export function generateObjectToExport(
  turmasSelecionadas: TurmaData[],
  nome: string,
  avaliacao: AvaliacaoData
) {
  const formularios: Record<string, number> = {};

  for (const turma of turmasSelecionadas) {
    /** Neste momento a prioridade sempre terá um valor, mas foi inserido para o lint não reclamar */
    if (turma.prioridade) {
      formularios[turma.id] = turma.prioridade;
    }
  }

  return {
    [nome]: {
      formularios,
      avaliacao,
    },
  };
}

export function exportJsonToFile(data: object, nome: string) {
  const jsonString = JSON.stringify(data, null, 2); // formata com indentação
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${nome}.json`; // nome do arquivo
  link.click();

  // Limpa o objeto de URL após o download
  URL.revokeObjectURL(url);
}
