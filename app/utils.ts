import { AvaliacaoData, Horario, TurmaData } from "./types";

/** Quantidade mínima de turmas que devem ser selecionadas. */
export const MIN_TURMAS = 10;

/** Converte "HH:MM" em minutos desde 00:00. */
function paraMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Retorna se dois horários ocorrem no mesmo dia com sobreposição de intervalo. */
export function horariosSobrepoem(a: Horario, b: Horario): boolean {
  return (
    a.dia === b.dia &&
    paraMinutos(a.inicio) < paraMinutos(b.fim) &&
    paraMinutos(b.inicio) < paraMinutos(a.fim)
  );
}

/**
 * Retorna as turmas selecionadas (id -> nome) que conflitam com ``turma``,
 * desconsiderando a própria turma.
 */
export function getConflitos(
  turma: TurmaData,
  selecionadas: Iterable<TurmaData>
): Map<string, string> {
  const turmasQueConflita = new Map<string, string>();
  for (const selecionada of selecionadas) {
    if (selecionada.uuid !== turma.uuid && turma.conflitos.has(selecionada.id)) {
      turmasQueConflita.set(selecionada.id, selecionada.nome);
    }
  }
  return turmasQueConflita;
}

/** Normaliza texto para busca: minúsculas e sem acentos. */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Nome válido = ao menos duas palavras (nome e sobrenome). */
export function nomeCompletoValido(nome: string): boolean {
  return nome.trim().split(/\s+/).filter(Boolean).length >= 2;
}

export function generateObjectToExport(
  turmasSelecionadas: TurmaData[],
  nome: string,
  avaliacao: AvaliacaoData,
  semNoturna: boolean
) {
  const formularios: Record<string, number> = {};

  // Exporta as turmas em ordem crescente de prioridade (1 = maior preferência).
  // Os ids ("CODIGO,TURMA") não são numéricos, então a ordem de inserção é
  // preservada no JSON.
  const ordenadas = [...turmasSelecionadas].sort(
    (a, b) => (a.prioridade ?? Infinity) - (b.prioridade ?? Infinity)
  );

  for (const turma of ordenadas) {
    /** Neste momento a prioridade sempre terá um valor, mas foi inserido para o lint não reclamar */
    if (turma.prioridade) {
      formularios[turma.id] = turma.prioridade;
    }
  }

  return {
    [nome]: {
      formularios,
      avaliacao,
      semNoturna,
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
  // Alguns navegadores exigem que o link esteja no DOM para o clique funcionar
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpa o objeto de URL após o download. Revogar imediatamente pode
  // cancelar o download em alguns navegadores, por isso o pequeno atraso.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
