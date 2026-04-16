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
  filtro: string = ''; // Nombre que usan tus compañeros
  estudianteSeleccionado: any = null;

  resultados = [
    { estudiante: 'Juan Pérez', identificacion: '1001', nota: 4.8 },
    { estudiante: 'Maria Lopez', identificacion: '1002', nota: 2.5 },
    { estudiante: 'Carlos Ruiz', identificacion: '1003', nota: 3.5 }
  ];

  get resultadosFiltrados() {
    return this.resultados.filter(r => 
      r.estudiante.toLowerCase().includes(this.filtro.toLowerCase()) || 
      r.identificacion.includes(this.filtro)
    );
  }

  seleccionarEstudiante(r: any) {
    this.estudianteSeleccionado = r;
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
  }
}