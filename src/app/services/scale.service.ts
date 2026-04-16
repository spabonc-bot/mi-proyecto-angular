import { Injectable } from '@angular/core';
import { ScaleModel } from '../models/scales';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  private escalas: ScaleModel[] = [
    { nombre: '0 - 5', min: 0, max: 5 },
    { nombre: '0 - 10', min: 0, max: 10 },
    { nombre: '0 - 100', min: 0, max: 100 }
  ];

  getEscalas(): ScaleModel[] {
    return this.escalas;
  }

  agregarEscala(escala: ScaleModel): void {
    this.escalas.push({ ...escala });
  }

  actualizarEscala(index: number, escala: ScaleModel): void {
    this.escalas[index] = { ...escala };
  }

  eliminarEscala(index: number): void {
    this.escalas.splice(index, 1);
  }
}