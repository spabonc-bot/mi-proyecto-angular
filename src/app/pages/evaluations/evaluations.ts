import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EvaluationService } from '../../services/evaluations.service';
import { TeacherService } from '../../services/teacher.service';
import { ScaleService } from '../../services/scale.service';

import { EvaluationModel } from '../../models/evaluation';
import { TeacherModel } from '../../models/teacher';
import { ScaleModel } from '../../models/scales';
import { COURSES } from '../../data/courses';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evaluations.html',
  styleUrls: ['./evaluations.css']
})
export class Evaluations implements OnInit {

  evaluacion: EvaluationModel = {
    nombre: '',
    tipo: 'multiple',
    cantidad: 0,
    escala: '',
    docente: '',
    preguntas: [],

    // Agregado ejercicio:

    asignacionTipo: '',
    estudianteAsignado: '',
    cursoAsignado: ''
  };

  docentes: TeacherModel[] = [];
  escalas: ScaleModel[] = [];

  // Agregado ejercicio:

  estudiantes: any[] = [];

  // Agregado ejercicio:

  courses: string[] = COURSES;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private teacherService: TeacherService,
    private scaleService: ScaleService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.evaluationService.inicializarEvaluacion();
    await this.teacherService.inicializarDatos();

    this.cargarDocentes();
    this.cargarEscalas();

    // Agregado ejercicio:
  
    this.cargarEstudiantes();
  }

  cargarDocentes(): void {
    this.docentes = this.teacherService.getDocentes();
  }

  cargarEscalas(): void {
    this.escalas = this.scaleService.getEscalas();

    if (this.escalas.length > 0 && !this.evaluacion.escala) {
      this.evaluacion.escala = this.escalas[0].nombre;
    }
  }

  // Agregado ejercicio:
  cargarEstudiantes(): void {
    this.estudiantes = JSON.parse(localStorage.getItem('estudiantes') || '[]');
  }

  // Agregado ejercicio:
  cambiarTipoAsignacion(): void {
    this.evaluacion.estudianteAsignado = '';
    this.evaluacion.cursoAsignado = '';
  }

  validarFormulario(): string | null {
    const e = this.evaluacion;

    // Corrección:
    // Limpia espacios antes de validar y guardar
    e.nombre = e.nombre.trim();
    e.escala = e.escala.trim();
    e.docente = e.docente.trim();
    e.estudianteAsignado = e.estudianteAsignado.trim();
    e.cursoAsignado = e.cursoAsignado.trim();

    const reglas = [
      () => !e.nombre && 'Ingrese el nombre de la evaluación',

      () => {
        if (!e.cantidad || Number(e.cantidad) <= 0) {
          return 'Ingrese una cantidad válida de preguntas';
        }

        return null;
      },

      () => !e.escala && 'Seleccione una escala',

      () => !e.docente && 'Seleccione un docente',

      () => {
        // Agregado ejercicio:
        if (!e.asignacionTipo) {
          return 'Seleccione si la evaluación será asignada a un estudiante o a un curso';
        }

        return null;
      },

      () => {
        if (e.asignacionTipo === 'estudiante' && !e.estudianteAsignado) {
          return 'Seleccione el estudiante al que se asignará la evaluación';
        }

        return null;
      },

      () => {

        if (e.asignacionTipo === 'curso' && !e.cursoAsignado) {
          return 'Seleccione el curso al que se asignará la evaluación';
        }

        return null;
      },

      () => {
        // Corrección:
        // Evita crear evaluaciones con el mismo nombre.
        const evaluaciones = this.evaluationService.getEvaluaciones();

        const existe = evaluaciones.some((ev: EvaluationModel) =>
          ev.nombre.trim().toLowerCase() === e.nombre.toLowerCase()
        );

        return existe && 'Ya existe una evaluación con ese nombre';
      }
    ];

    // Mejora:
    // Muestra solo el primer error, no todos juntos.
    for (const regla of reglas) {
      const error = regla();
      if (error) return error;
    }

    return null;
  }

  crearEvaluacion(): void {
    const error = this.validarFormulario();

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Revise el formulario',
        text: error
      });
      return;
    }

    const evaluacionCompleta: EvaluationModel = {
      ...this.evaluacion,
      cantidad: Number(this.evaluacion.cantidad),
      preguntas: []
    };

    this.evaluationService.guardarEvaluacion(evaluacionCompleta);

    Swal.fire({
      icon: 'success',
      title: 'Evaluación creada',
      text: 'Ahora agrega las preguntas correspondientes.',
      confirmButtonText: 'Agregar preguntas'
    }).then(() => {
      this.router.navigate(['/preguntas']);
    });
  }

  cerrarSesion(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Desea salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
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
}