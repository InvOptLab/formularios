export type Horario = {
  dia: string; // "Seg." | "Ter." | "Qua." | "Qui." | "Sex." | "Sáb." | "Dom."
  inicio: string;
  fim: string;
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
  nivel: string; // 'p' | 'g'
  conflitos: string[];
  noturna: boolean;
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
  nivel: string; // 'p' | 'g'
  conflitos: Set<string>;
  noturna: boolean;
};

export type AvaliacaoData = {
  nota: number | null;
  comentario: string;
  preferencia: "Agrupar" | "Espalhar" | "Indiferente";
};
