import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class Student {

  estudiantes:any[] = [];

  busqueda:string = '';

  estudiante = {
    nombre: '',
    apellido: '',
    id: '',
    correo: '',
    nota: 0,
    estado: 'Pendiente'
  }

  guardar(){
    this.estudiantes.push({...this.estudiante});
    this.limpiar();
  }

  limpiar(){
    this.estudiante = {
      nombre: '',
      apellido: '',
      id: '',
      correo: '',
      nota: 0,
      estado: 'Pendiente'
    }
  }

  get estudiantesFiltrados(){
    return this.estudiantes.filter(e =>
      e.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

}
