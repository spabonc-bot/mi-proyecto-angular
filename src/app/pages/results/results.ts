import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class Results {
  busqueda: string = '';
  estudianteSeleccionado: any = null;

  // Datos de prueba para que veas algo de una vez
  resultados = [
    { nombre: 'Juan', apellido: 'Pérez', id: '1001', nota: 4.8 },
    { nombre: 'Maria', apellido: 'Lopez', id: '1002', nota: 2.5 },
    { nombre: 'Carlos', apellido: 'Ruiz', id: '1003', nota: 3.5 }
  ];

  get resultadosFiltrados() {
    return this.resultados.filter(r => 
      r.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) || 
      r.id.includes(this.busqueda)
    );
  }

  seleccionarEstudiante(estudiante: any) {
    this.estudianteSeleccionado = estudiante;
  }
}