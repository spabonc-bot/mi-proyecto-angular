import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TeacherModel } from '../models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private KEY = 'docentes';

  constructor(private http: HttpClient) {}

  
  async inicializarDatos() {
    const datos = localStorage.getItem(this.KEY);
    const lista: TeacherModel[] = JSON.parse(datos || '[]');

    if (lista.length === 0) {
      try {
        const datosJSON = await firstValueFrom(
          this.http.get<TeacherModel[]>('assets/docentes.json')
        );

        localStorage.setItem(this.KEY, JSON.stringify(datosJSON));
        console.log('Datos cargados desde JSON');
      } catch (error) {
        console.error('Error cargando JSON', error);
      }
    }
  }

  
  getDocentes(): TeacherModel[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  
  guardarDocentes(lista: TeacherModel[]) {
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  }

  
  agregar(docente: TeacherModel) {
    const lista = this.getDocentes();
    lista.push(docente);
    this.guardarDocentes(lista);
  }

  
  actualizar(index: number, docente: TeacherModel) {
    const lista = this.getDocentes();
    if (lista[index]) {
      lista[index] = docente;
      this.guardarDocentes(lista);
    }
  }

  
  eliminar(index: number) {
    const lista = this.getDocentes();
    lista.splice(index, 1);
    this.guardarDocentes(lista);
  }

  
  existeIdentificacion(identificacion: string): boolean {
    return this.getDocentes().some(
      d => d.identificacion === identificacion
    );
  }

  
  buscarPorIdentificacion(identificacion: string): TeacherModel | undefined {
    return this.getDocentes().find(
      d => d.identificacion === identificacion
    );
  }
}