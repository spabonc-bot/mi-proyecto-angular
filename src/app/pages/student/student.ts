import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentService } from '../../services/student.service';
import { StudentModel } from '../../models/student';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export class Student implements OnInit {

  estudiante: any = {
    nombre: '',
    apellido: '',
    identificacion: '',
    correo: '',
    password: '',
    estado: 'activo',
    nota: 0,
    estadoResultado: 'pendiente'
  };

  listaEstudiantes: any[] = [];
  filtro: string = '';
  editando: boolean = false;
  indiceEdicion: number | null = null;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.listaEstudiantes = this.studentService.getEstudiantes();
  }

  get estudiantesFiltrados(): any[] {
    return this.listaEstudiantes.filter(est =>
      `${est.nombre} ${est.apellido}`.toLowerCase().includes(this.filtro.toLowerCase()) ||
      est.identificacion.toLowerCase().includes(this.filtro.toLowerCase()) ||
      est.correo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  guardarEstudiante(): void {
    const e = this.estudiante;

    const reglas = [
      () => !e.nombre.trim() && 'El nombre es obligatorio',
      () => !e.apellido.trim() && 'El apellido es obligatorio',
      () => !e.identificacion.trim() && 'La identificación es obligatoria',
      () => !/^[0-9]+$/.test(e.identificacion) && 'La identificación debe ser numérica',
      () => e.identificacion.length < 5 && 'La identificación debe tener mínimo 5 dígitos',
      () => !e.correo.trim() && 'El correo es obligatorio',
      () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.correo) && 'Correo inválido',
      () => !this.editando && !e.password.trim() && 'La contraseña es obligatoria',
      () => !this.editando && e.password.length < 6 && 'La contraseña debe tener mínimo 6 caracteres'
    ];

    const errores = reglas
      .map(r => r())
      .filter(m => m) as string[];

    if (errores.length) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errores.join(', ')
      });
      return;
    }

    if (!this.editando && this.studentService.existeIdentificacion(e.identificacion)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya existe un estudiante con esa identificación'
      });
      return;
    }

    if (this.editando && this.indiceEdicion !== null) {
      this.studentService.actualizar(this.indiceEdicion, this.estudiante);

      Swal.fire({
        icon: 'success',
        title: 'Estudiante actualizado',
        timer: 1200,
        showConfirmButton: false
      });

    } else {
      this.studentService.registrar(this.estudiante);

      Swal.fire({
        icon: 'success',
        title: 'Estudiante registrado',
        timer: 1200,
        showConfirmButton: false
      });
    }

    this.cargarEstudiantes();
    this.limpiarFormulario();
  }

  editarEstudiante(index: number): void {
    const est = this.estudiantesFiltrados[index];

    const indexReal = this.listaEstudiantes.findIndex(
      e => e.identificacion === est.identificacion
    );

    if (indexReal === -1) return;

    this.estudiante = { ...this.listaEstudiantes[indexReal] };
    this.editando = true;
    this.indiceEdicion = indexReal;
  }

  eliminarEstudiante(index: number): void {
    const est = this.estudiantesFiltrados[index];

    const indexReal = this.listaEstudiantes.findIndex(
      e => e.identificacion === est.identificacion
    );

    if (indexReal === -1) return;

    Swal.fire({
      title: '¿Eliminar estudiante?',
      text: `${est.nombre} ${est.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.studentService.eliminar(indexReal);
      this.cargarEstudiantes();

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        timer: 1200,
        showConfirmButton: false
      });
    });
  }

  cancelar(): void {
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.estudiante = {
      nombre: '',
      apellido: '',
      identificacion: '',
      correo: '',
      password: '',
      estado: 'activo',
      nota: 0,
      estadoResultado: 'pendiente'
    };

    this.editando = false;
    this.indiceEdicion = null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActivo');
    this.router.navigate(['/']);
  }
}