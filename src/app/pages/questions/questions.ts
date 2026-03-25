import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './questions.html',
  styleUrls: ['./questions.css']
})
export class Questions {

  constructor(private router: Router) {
    this.cargarEvaluacion();
  }

  evaluacion: any = null;

  pregunta = {
    enunciado: '',
    opcionA: '',
    opcionB: '',
    opcionC: '',
    opcionD: '',
    respuesta: ''
  };

  listaPreguntas: any[] = [];
  editandoIndex: number = -1;

  
  cargarEvaluacion() {
    const data = localStorage.getItem('evaluacionActiva');

    if (!data) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay evaluación',
        text: 'Primero debes crear una evaluación'
      }).then(() => {
        this.router.navigate(['/evaluaciones']);
      });
      return;
    }

    this.evaluacion = JSON.parse(data);
    this.listaPreguntas = this.evaluacion.preguntas || [];
  }

  
  get totalPreguntas() {
    return this.evaluacion?.cantidad || 0;
  }

  guardarPregunta() {

    if (!this.evaluacion) return;

    const errores = this.validarFormulario();

    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: errores.join(', ')
      });
      return;
    }

    
    if (this.editandoIndex === -1 && this.listaPreguntas.length >= this.totalPreguntas) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Ya completaste todas las preguntas'
      });
      return;
    }

    if (this.editandoIndex >= 0) {
      this.listaPreguntas[this.editandoIndex] = { ...this.pregunta };
      this.editandoIndex = -1;

      Swal.fire({
        icon: 'success',
        title: 'Pregunta actualizada',
        timer: 1000,
        showConfirmButton: false
      });

    } else {

      this.listaPreguntas.push({ ...this.pregunta });

      Swal.fire({
        icon: 'success',
        title: 'Pregunta guardada',
        timer: 1000,
        showConfirmButton: false
      });
    }

    
    this.evaluacion.preguntas = this.listaPreguntas;
    localStorage.setItem('evaluacionActiva', JSON.stringify(this.evaluacion));

    this.limpiarFormulario();
  }

  validarFormulario(): string[] {
  const errores: string[] = [];

  if (!this.pregunta.enunciado.trim()) {
    errores.push('Ingrese la pregunta');
  }

  
  if (this.evaluacion.tipo === 'multiple') {

    if (!this.pregunta.opcionA || !this.pregunta.opcionB ||
        !this.pregunta.opcionC || !this.pregunta.opcionD) {
      errores.push('Complete todas las opciones');
    }

    const r = this.pregunta.respuesta.toUpperCase();

    if (!['A', 'B', 'C', 'D'].includes(r)) {
      errores.push('Respuesta debe ser A, B, C o D');
    }
  }

  
  if (this.evaluacion.tipo === 'vf') {
    if (!['V', 'F'].includes(this.pregunta.respuesta)) {
      errores.push('Seleccione Verdadero o Falso');
    }
  }

  
  if (this.evaluacion.tipo === 'abierta') {
    if (!this.pregunta.respuesta.trim()) {
      errores.push('Ingrese la respuesta');
    }
  }

  return errores;
}

  limpiarFormulario() {
    this.pregunta = {
      enunciado: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuesta: ''
    };
  }

  siguientePregunta() {
    this.limpiarFormulario();
  }

  editarPregunta(index: number) {
    this.pregunta = { ...this.listaPreguntas[index] };
    this.editandoIndex = index;
  }

  eliminarPregunta(index: number) {

    this.listaPreguntas.splice(index, 1);

    this.evaluacion.preguntas = this.listaPreguntas;
    localStorage.setItem('evaluacionActiva', JSON.stringify(this.evaluacion));
  }

  cancelarEdicion() {
    this.editandoIndex = -1;
    this.limpiarFormulario();
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }
}