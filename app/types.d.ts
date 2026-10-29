export type Horario = {
  dia: string; // "Seg." | "Ter." | "Qua." | "Qui." | "Sex." | "Sáb." | "Dom."
  inicio: string;
  fim: string;
};

/** 'g' = graduação, 'p' = pós-graduação, 'g+p' = turma espelho (graduação + pós). */
export type Nivel = "g" | "p" | "g+p";

/** Dados da turma da pós que foi mesclada na turma espelho da graduação. */
export type TurmaEspelho = {
  codigo: string;
  id: string;
  nome: string;
  ementa: string;
  uuid: string;
};

export type TurmaDataInicial = {
  id: string;
  codigo: string;
  nome: string;
  turma: number;
  horarios: Horario[];
  curso: string;
  ementa: string;
  ingles?: boolean;
  prioridade?: number;
  nivel: Nivel;
  espelho?: TurmaEspelho;
  conflitos: string[];
  noturna: boolean;
  grupo?: string;
  carga: number;
  uuid: string;
};

export type TurmaData = {
  id: string;
  codigo: string;
  nome: string;
  turma: number;
  horarios: Horario[];
  curso: string;
  ementa: string;
  ingles?: boolean;
  prioridade?: number;
  nivel: Nivel;
  espelho?: TurmaEspelho;
  conflitos: Set<string>;
  noturna: boolean;
  grupo?: string;
  carga: number;
  uuid: string;
};

export type AvaliacaoData = {
  nota: number | null;
  comentario: string;
  preferencia: "Agrupar" | "Espalhar" | "Indiferente";
};
