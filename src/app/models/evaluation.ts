import { QuestionModel } from "./question";

export interface EvaluationModel {
  nombre: string;
  tipo: 'multiple' | 'vf' | 'abierta';
  cantidad: number;
  escala: string;
  docente: string;
  preguntas: QuestionModel[];
<<<<<<< HEAD
  //agregado 
  asignacionTipo: 'estudiante' | 'curso' | '';
  estudianteAsignado: string;
  cursoAsignado: string;
=======
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa
}