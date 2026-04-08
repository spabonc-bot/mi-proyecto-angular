import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EvaluationService } from '../../services/evaluations.service';
import { TeacherService } from '../../services/teacher.service';

import { EvaluationModel } from '../../models/evaluation';
import { TeacherModel } from '../../models/teacher';

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
    escala: '0 - 5',
    docente: '',
    preguntas: []
  };

  docentes: TeacherModel[] = [];

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private teacherService: TeacherService
  ) {}

  async ngOnInit(): Promise<void> {
  await this.evaluationService.inicializarEvaluacion();
  this.cargarDocentes();
}

  cargarDocentes(): void {
    this.docentes = this.teacherService.getDocentes();
  }

  crearEvaluacion(): void {

    const e = this.evaluacion;

    const errores = [
      !e.nombre.trim() && 'Ingrese el nombre',
      (!e.cantidad || e.cantidad <= 0) && 'Cantidad inválida',
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
  
}