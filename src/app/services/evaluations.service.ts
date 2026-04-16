import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EvaluationModel } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private LIST_KEY = 'evaluaciones';
  private ACTIVE_KEY = 'evaluacionActiva';

  constructor(private http: HttpClient) {}

  async inicializarEvaluacion(): Promise<void> {
    const data = localStorage.getItem(this.LIST_KEY);

    if (!data || data === 'null') {
      const lista = await firstValueFrom(
        this.http.get<EvaluationModel[]>('assets/evaluaciones.json')
      );

      localStorage.setItem(this.LIST_KEY, JSON.stringify(lista || []));

      if (lista && lista.length > 0) {
        localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(lista[0]));
      }
    }
  }

  getEvaluaciones(): EvaluationModel[] {
    const data = localStorage.getItem(this.LIST_KEY);
    return data ? JSON.parse(data) : [];
  }

  guardarEvaluacion(evaluacion: EvaluationModel): void {
    const lista = this.getEvaluaciones();

    const index = lista.findIndex(e => e.nombre === evaluacion.nombre);

    if (index !== -1) {
      lista[index] = evaluacion;
    } else {
      lista.push(evaluacion);
    }

    localStorage.setItem(this.LIST_KEY, JSON.stringify(lista));
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(evaluacion));
  }

  setEvaluacionActiva(evaluacion: EvaluationModel): void {
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(evaluacion));
  }

  getEvaluacion(): EvaluationModel | null {
    const data = localStorage.getItem(this.ACTIVE_KEY);
    return data ? JSON.parse(data) : null;
  }

  limpiarEvaluacion(): void {
    localStorage.removeItem(this.ACTIVE_KEY);
  }

  eliminarEvaluacion(nombre: string): void {
    const lista = this.getEvaluaciones().filter(e => e.nombre !== nombre);
    localStorage.setItem(this.LIST_KEY, JSON.stringify(lista));

    const activa = this.getEvaluacion();
    if (activa?.nombre === nombre) {
      localStorage.removeItem(this.ACTIVE_KEY);
    }
  }
}