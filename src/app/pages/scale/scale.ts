import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scale.html',
  styleUrls: ['./scale.css']
})
export class Scale {
  nombre: string = '';
  notaMin: number | null = null;
  notaMax: number | null = null;
  mostrarFormulario: boolean = false;
  editarEscalaId: number | null = null;

  escalas = [
    { id: 1, nombre: '0 - 5', notaMin: 0, notaMax: 5 },
    { id: 2, nombre: '0 - 100', notaMin: 0, notaMax: 100 }
  ];

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  guardarEscala() {
    if (this.nombre && this.notaMin !== null && this.notaMax !== null) {
      if (this.editarEscalaId) {
        const index = this.escalas.findIndex(e => e.id === this.editarEscalaId);
        this.escalas[index] = { id: this.editarEscalaId, nombre: this.nombre, notaMin: this.notaMin, notaMax: this.notaMax };
      } else {
        const nuevoId = this.escalas.length > 0 ? Math.max(...this.escalas.map(e => e.id)) + 1 : 1;
        this.escalas.push({ id: nuevoId, nombre: this.nombre, notaMin: this.notaMin, notaMax: this.notaMax });
      }
      this.cancelar();
    }
  }

  editarEscala(escala: any) {
    this.editarEscalaId = escala.id;
    this.nombre = escala.nombre;
    this.notaMin = escala.notaMin;
    this.notaMax = escala.notaMax;
    this.mostrarFormulario = true;
  }

  eliminarEscala(id: number) {
    this.escalas = this.escalas.filter(e => e.id !== id);
  }

  cancelar() {
    this.nombre = '';
    this.notaMin = null;
    this.notaMax = null;
    this.editarEscalaId = null;
    this.mostrarFormulario = false;
  }
}