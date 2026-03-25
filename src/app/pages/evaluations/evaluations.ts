import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evaluations.html',
  styleUrls: ['./evaluations.css']
})
export class Evaluations implements OnInit {

  constructor(private router: Router) {}

  evaluacion = {
    nombre: '',
    tipo: 'multiple',
    cantidad: 0,
    escala: '0 - 5',
    docente: ''
  };

  docentes: any[] = [];

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    const data = localStorage.getItem('docentes');
    this.docentes = data ? JSON.parse(data) : [];
  }

  crearEvaluacion(): void {

  const errores: string[] = [];

  if (!this.evaluacion.nombre.trim()) {
    errores.push('Ingrese el nombre');
  }

  if (!this.evaluacion.cantidad || this.evaluacion.cantidad <= 0) {
    errores.push('Cantidad inválida');
  }

  if (!this.evaluacion.docente) {
    errores.push('Seleccione docente');
  }

  if (errores.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: errores.join(', ')
    });
    return;
  }

  
  this.evaluacion.cantidad = Number(this.evaluacion.cantidad);

  const evaluacionCompleta = {
    ...this.evaluacion,
    preguntas: []
  };

  localStorage.setItem('evaluacionActiva', JSON.stringify(evaluacionCompleta));

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