import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private evaluationService: EvaluationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEvaluacion();
  }

  cargarEvaluacion(): void {
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

    
    this.listaPreguntas = [...(data.preguntas || [])];

    this.cd.detectChanges();
  }

  get totalPreguntas(): number {
    return this.evaluacion?.cantidad || 0;
  }

  get preguntasCompletas(): boolean {
    return this.listaPreguntas.length === this.totalPreguntas;
  }

  guardarPregunta(): void {
    const errores = this.validarFormulario();

    if (errores.length) {
      Swal.fire({
        icon: 'error',
        title: 'Revise el formulario',
        html: `
          <ul style="text-align:left">
            ${errores.map(error => `<li>${error}</li>`).join('')}
          </ul>
        `
      });
      return;
    }

    if (this.editandoIndex === -1 && this.listaPreguntas.length >= this.totalPreguntas) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Ya completaste todas las preguntas configuradas para esta evaluación'
      });
      return;
    }

    if (this.editandoIndex >= 0) {
      this.listaPreguntas[this.editandoIndex] = { ...this.pregunta };
      this.mostrarExito('Pregunta actualizada correctamente');
    } else {
      this.listaPreguntas.push({ ...this.pregunta });
      this.mostrarExito('Pregunta guardada correctamente');
    }

    
    this.listaPreguntas = [...this.listaPreguntas];

    this.guardarEnStorage();
    this.limpiarFormulario();

    
    this.cd.detectChanges();
  }

  validarFormulario(): string[] {
    const p = this.pregunta;
    const tipo = this.evaluacion.tipo;

    p.enunciado = p.enunciado.trim();
    p.opcionA = (p.opcionA || '').trim();
    p.opcionB = (p.opcionB || '').trim();
    p.opcionC = (p.opcionC || '').trim();
    p.opcionD = (p.opcionD || '').trim();
    p.respuesta = p.respuesta.trim().toUpperCase();

    const reglas = [
      () => !p.enunciado && 'Ingrese la pregunta',

      () => {
        if (tipo !== 'multiple') return null;

        if (!p.opcionA || !p.opcionB || !p.opcionC || !p.opcionD) {
          return 'Complete todas las opciones';
        }

        if (!['A', 'B', 'C', 'D'].includes(p.respuesta)) {
          return 'La respuesta debe ser A, B, C o D';
        }

        return null;
      },

      () => {
        if (tipo !== 'vf') return null;

        if (!['V', 'F'].includes(p.respuesta)) {
          return 'Seleccione Verdadero o Falso';
        }

        return null;
      },

      () => {
        if (tipo !== 'abierta') return null;

        if (!p.respuesta) {
          return 'Ingrese la respuesta';
        }

        return null;
      }
    ];

    return reglas
      .map(regla => regla())
      .filter(mensaje => mensaje) as string[];
  }

  guardarEnStorage(): void {
    
    this.evaluacion.preguntas = [...this.listaPreguntas];

    
    this.evaluationService.guardarEvaluacion(this.evaluacion);
  }

  limpiarFormulario(): void {
    this.pregunta = {
      enunciado: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuesta: ''
    };

    this.editandoIndex = -1;
  }

  editarPregunta(index: number): void {
    this.pregunta = { ...this.listaPreguntas[index] };
    this.editandoIndex = index;
  }

  eliminarPregunta(index: number): void {
    Swal.fire({
      title: '¿Eliminar pregunta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      // elimina visualmente 
      this.listaPreguntas = this.listaPreguntas.filter((_, i) => i !== index);

      this.guardarEnStorage();

      if (this.editandoIndex === index) {
        this.limpiarFormulario();
      }

      this.cd.detectChanges();

      this.mostrarExito('Pregunta eliminada correctamente');
    });
  }

  verPregunta(index: number): void {
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

  finalizarEvaluacion(): void {
    if (this.listaPreguntas.length < this.totalPreguntas) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan preguntas',
        text: `Debes registrar ${this.totalPreguntas} preguntas. Actualmente tienes ${this.listaPreguntas.length}.`
      });
      return;
    }

    this.guardarEnStorage();

    Swal.fire({
      icon: 'success',
      title: 'Evaluación creada correctamente',
      text: 'La evaluación quedó lista para que los estudiantes puedan presentarla.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      localStorage.removeItem('evaluacionActiva');
      this.router.navigate(['/evaluaciones']);
    });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  cerrarSesion(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Desea salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      localStorage.removeItem('usuarioActivo');

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        timer: 1200,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/']);
      });
    });
  }

  mostrarExito(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      title: mensaje,
      timer: 1000,
      showConfirmButton: false
    });
  }
}