import { Injectable } from '@angular/core';
import { StudentModel } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private KEY = 'estudiantes';

  getEstudiantes(): StudentModel[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  guardarEstudiantes(lista: StudentModel[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  }

  existeIdentificacion(identificacion: string): boolean {
    return this.getEstudiantes().some(
      est => est.identificacion === identificacion
    );
  }

  registrar(estudiante: StudentModel): void {
    const lista = this.getEstudiantes();
    lista.push({ ...estudiante });
    this.guardarEstudiantes(lista);
  }

  
  actualizar(index: number, estudiante: StudentModel): void {
    const lista = this.getEstudiantes();
    lista[index] = { ...estudiante };
    this.guardarEstudiantes(lista);
  }

  
  eliminar(index: number): void {
    const lista = this.getEstudiantes();
    lista.splice(index, 1);
    this.guardarEstudiantes(lista);
  }

  buscarPorCredenciales(
    identificacion: string,
    password: string
  ): StudentModel | null {
    return this.getEstudiantes().find(
      est => est.identificacion === identificacion && est.password === password
    ) || null;
  }
}