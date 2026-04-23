import { Component } from '@angular/core';
<<<<<<< HEAD
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
=======
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
>>>>>>> 301906fa262fcb1aa87e932978248093548adada

@Component({
  selector: 'app-results',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, FormsModule], 
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class ResultsComponent {
  // VARIABLES QUE EL HTML ESTÁ BUSCANDO
  estudiante: string = '';
  nota: number | null = null;
  mostrarFormulario: boolean = false;
  evaluacion: string = 'Matemáticas-Examen Final';

  resultados = [
    { estudiante: 'Juan perez', nota: 6.5 },
    { estudiante: 'Ariana Gomez', nota: 6.4 },
    { estudiante: 'jhoan muñoz', nota: 4.2 }
  ];

  
  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  guardarResultado() {
    if (this.estudiante && this.nota !== null) {
      this.resultados.push({
        estudiante: this.estudiante,
        nota: this.nota
      });
      this.cancelar();
    }
  }

  cancelar() {
    this.estudiante = '';
    this.nota = null;
    this.mostrarFormulario = false;
=======
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
>>>>>>> 301906fa262fcb1aa87e932978248093548adada
  }
}