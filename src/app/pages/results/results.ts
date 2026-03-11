import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ESTO QUITA EL ERROR DE NGIF Y NGCLASS
import { FormsModule } from '@angular/forms';   // ESTO QUITA EL ERROR DE NGMODEL

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- ESTO ES LO MÁS IMPORTANTE
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

  // FUNCIONES QUE EL HTML ESTÁ BUSCANDO
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
  }
}