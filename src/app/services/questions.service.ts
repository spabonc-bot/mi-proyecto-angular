import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private KEY = 'evaluacionActiva';

  getEvaluacion(): any {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  guardarEvaluacion(evaluacion: any) {
    localStorage.setItem(this.KEY, JSON.stringify(evaluacion));
  }

  getPreguntas(): QuestionModel[] {
    const evaluacion = this.getEvaluacion();
    return evaluacion?.preguntas || [];
  }

  agregarPregunta(pregunta: QuestionModel) {
    const evaluacion = this.getEvaluacion();

    if (!evaluacion) return;

    evaluacion.preguntas.push(pregunta);
    this.guardarEvaluacion(evaluacion);
  }

  actualizarPregunta(index: number, pregunta: QuestionModel) {
    const evaluacion = this.getEvaluacion();

    if (!evaluacion) return;

    evaluacion.preguntas[index] = pregunta;
    this.guardarEvaluacion(evaluacion);
  }

  eliminarPregunta(index: number) {
    const evaluacion = this.getEvaluacion();

    if (!evaluacion) return;

    evaluacion.preguntas.splice(index, 1);
    this.guardarEvaluacion(evaluacion);
  }

  limpiarEvaluacion() {
    localStorage.removeItem(this.KEY);
  }
}