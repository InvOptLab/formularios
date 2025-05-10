export type Horario = {
  dia: string; // "Seg." | "Ter." | "Qua." | "Qui." | "Sex." | "Sáb." | "Dom."
  inicio: string;
  fim: string;
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
};
