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
    preguntas: []
  };

  docentes: TeacherModel[] = [];
  escalas: ScaleModel[] = [];

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private teacherService: TeacherService,
    private scaleService: ScaleService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.evaluationService.inicializarEvaluacion();
    this.cargarDocentes();
    this.cargarEscalas();
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

  crearEvaluacion(): void {
    const e = this.evaluacion;

    const errores = [
      !e.nombre.trim() && 'Ingrese el nombre',
      (!e.cantidad || e.cantidad <= 0) && 'Cantidad inválida',
      !e.escala && 'Seleccione escala',
      !e.docente && 'Seleccione docente'
    ].filter(Boolean) as string[];

    if (errores.length) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: errores.join(', ')
      });
      return;
    }

    e.cantidad = Number(e.cantidad);

    const evaluacionCompleta: EvaluationModel = {
      ...e,
      preguntas: []
    };

    this.evaluationService.guardarEvaluacion(evaluacionCompleta);

    Swal.fire({
      icon: 'success',
      title: 'Evaluación creada',
      timer: 1200,
      showConfirmButton: false
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
