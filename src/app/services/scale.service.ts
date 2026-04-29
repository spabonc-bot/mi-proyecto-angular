import { Injectable } from '@angular/core';
import { ScaleModel } from '../models/scales';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  private KEY = 'escalas';

  private escalasBase: ScaleModel[] = [
    { nombre: '0 - 5', min: 0, max: 5 },
    { nombre: '0 - 10', min: 0, max: 10 },
    { nombre: '0 - 100', min: 0, max: 100 }
  ];

  getEscalas(): ScaleModel[] {
    const data = localStorage.getItem(this.KEY);

    if (!data) {
      localStorage.setItem(this.KEY, JSON.stringify(this.escalasBase));
      return [...this.escalasBase];
    }

    return JSON.parse(data);
  }

  guardarEscalas(lista: ScaleModel[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  }

  agregarEscala(escala: ScaleModel): void {
    const lista = this.getEscalas();
    lista.push({ ...escala });
    this.guardarEscalas(lista);
  }

  actualizarEscala(index: number, escala: ScaleModel): void {
    const lista = this.getEscalas();
    lista[index] = { ...escala };
    this.guardarEscalas(lista);
  }

  eliminarEscala(index: number): void {
    const lista = this.getEscalas();
    lista.splice(index, 1);
    this.guardarEscalas(lista);
  }
}