import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EvaluationService } from '../../services/evaluations.service';
import { EvaluationModel } from '../../models/evaluation';
import { QuestionModel } from '../../models/question';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './questions.html',
  styleUrls: ['./questions.css']
})
export class Questions implements OnInit {

  evaluacion!: EvaluationModel;

  pregunta: QuestionModel = {
    enunciado: '',
    opcionA: '',
    opcionB: '',
    opcionC: '',
    opcionD: '',
    respuesta: ''
  };

  listaPreguntas: QuestionModel[] = [];
  editandoIndex: number = -1;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.cargarEvaluacion();
  }

  cargarEvaluacion() {
    const data = this.evaluationService.getEvaluacion();

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

    this.evaluacion = data;
    this.listaPreguntas = data.preguntas || [];
  }

  get totalPreguntas() {
    return this.evaluacion?.cantidad || 0;
  }

  guardarPregunta() {

    const errores = this.validarFormulario();

    if (errores.length) {
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

      this.mostrarExito('Pregunta actualizada');

    } else {
      this.listaPreguntas.push({ ...this.pregunta });
      this.mostrarExito('Pregunta guardada');
    }

    this.guardarEnStorage();
    this.limpiarFormulario();
  }

  validarFormulario(): string[] {

    const p = this.pregunta;
    const tipo = this.evaluacion.tipo;

    const reglas = [
      () => !p.enunciado.trim() && 'Ingrese la pregunta',

      () => tipo === 'multiple' &&
        (!p.opcionA || !p.opcionB || !p.opcionC || !p.opcionD) &&
        'Complete todas las opciones',

      () => tipo === 'multiple' &&
        !['A', 'B', 'C', 'D'].includes(p.respuesta.toUpperCase()) &&
        'Respuesta debe ser A, B, C o D',

      () => tipo === 'vf' &&
        !['V', 'F'].includes(p.respuesta.toUpperCase()) &&
        'Seleccione Verdadero o Falso',

      () => tipo === 'abierta' &&
        !p.respuesta.trim() &&
        'Ingrese la respuesta'
    ];

    return reglas
      .map(r => r())
      .filter(m => m) as string[];
  }

  guardarEnStorage() {
    this.evaluacion.preguntas = this.listaPreguntas;
    this.evaluationService.guardarEvaluacion(this.evaluacion);
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

  editarPregunta(index: number) {
    this.pregunta = { ...this.listaPreguntas[index] };
    this.editandoIndex = index;
  }

  eliminarPregunta(index: number) {
    this.listaPreguntas.splice(index, 1);
    this.guardarEnStorage();
  }

  verPregunta(index: number) {
    const p = this.listaPreguntas[index];

    let contenido = `<strong>${p.enunciado}</strong><br><br>`;

    if (this.evaluacion.tipo === 'multiple') {
      contenido += `
        A: ${p.opcionA}<br>
        B: ${p.opcionB}<br>
        C: ${p.opcionC}<br>
        D: ${p.opcionD}<br><br>
      `;
    }

    contenido += `<b>Respuesta:</b> ${p.respuesta}`;

    Swal.fire({
      title: 'Detalle de la pregunta',
      html: contenido,
      icon: 'info'
    });
  }

  cancelarEdicion() {
    this.editandoIndex = -1;
    this.limpiarFormulario();
  }

  cerrarSesion() {
    this.router.navigate(['/']);
  }

  mostrarExito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: mensaje,
      timer: 1000,
      showConfirmButton: false
    });
  }
}