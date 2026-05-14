import { QuestionModel } from "./question";

export interface EvaluationModel {
  nombre: string;
  tipo: 'multiple' | 'vf' | 'abierta';
  cantidad: number;
  escala: string;
  docente: string;
  preguntas: QuestionModel[];
  //agregado 
  asignacionTipo: 'estudiante' | 'curso' | '';
  estudianteAsignado: string;
  cursoAsignado: string;
}