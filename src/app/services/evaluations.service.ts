import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EvaluationModel } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private KEY = 'evaluacionActiva';

  constructor(private http: HttpClient) {}

  async inicializarEvaluacion() {
    const data = localStorage.getItem(this.KEY);

    if (!data || data === 'null') {
      const lista = await firstValueFrom(
        this.http.get<EvaluationModel[]>('assets/evaluaciones.json')
      );

      if (lista && lista.length > 0) {
        localStorage.setItem(this.KEY, JSON.stringify(lista[0]));
      }
    }
  }

  guardarEvaluacion(evaluacion: EvaluationModel) {
    localStorage.setItem(this.KEY, JSON.stringify(evaluacion));
  }

  getEvaluacion(): EvaluationModel | null {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  limpiarEvaluacion() {
    localStorage.removeItem(this.KEY);
  }
}