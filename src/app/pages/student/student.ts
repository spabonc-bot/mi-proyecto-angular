import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentService } from '../../services/student.service';

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
    nota: 0
  };

  listaEstudiantes: any[] = [];
  filtro: string = '';
  editando: boolean = false;
  indiceEdicion: number | null = null;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    
    this.listaEstudiantes = [...this.studentService.getEstudiantes()];
  }

  get estudiantesFiltrados(): any[] {
    return this.listaEstudiantes.filter(est =>
      `${est.nombre} ${est.apellido}`.toLowerCase().includes(this.filtro.toLowerCase()) ||
      est.identificacion.toLowerCase().includes(this.filtro.toLowerCase()) ||
      est.correo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  validarFormulario(): string | null {
    const e = this.estudiante;

    e.nombre = e.nombre.trim();
    e.apellido = e.apellido.trim();
    e.identificacion = e.identificacion.trim();
    e.correo = e.correo.trim();

    if (!this.editando) {
      e.password = e.password.trim();
    }

    const reglas = [
      () => !e.nombre && 'El nombre es obligatorio',
      () => e.nombre && e.nombre.length < 3 && 'El nombre debe tener mínimo 3 caracteres',

      () => !e.apellido && 'El apellido es obligatorio',
      () => e.apellido && e.apellido.length < 3 && 'El apellido debe tener mínimo 3 caracteres',

      () => {
        if (!e.identificacion) return 'La identificación es obligatoria';
        if (!/^[0-9]+$/.test(e.identificacion)) return 'La identificación debe ser numérica';
        if (e.identificacion.length < 5) return 'La identificación debe tener mínimo 5 dígitos';
        return null;
      },

      () => {
        if (!e.correo) return 'El correo es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.correo)) return 'El correo no es válido';
        return null;
      },

      () => {
        if (this.editando) return null;
        if (!e.password) return 'La contraseña es obligatoria';
        if (e.password.length < 6) return 'La contraseña debe tener mínimo 6 caracteres';
        return null;
      },

      () => {
        const duplicado = this.listaEstudiantes.some((est, index) =>
          est.identificacion === e.identificacion &&
          index !== this.indiceEdicion
        );

        return duplicado && 'Ya existe otro estudiante con esa identificación';
      }
    ];

    for (const regla of reglas) {
      const error = regla();
      if (error) return error;
    }

    return null;
  }

  guardarEstudiante(): void {
    const error = this.validarFormulario();

    if (error) {
      this.mostrarError(error);
      return;
    }

    if (this.editando && this.indiceEdicion !== null) {
      this.studentService.actualizar(this.indiceEdicion, { ...this.estudiante });

      Swal.fire({
        icon: 'success',
        title: 'Estudiante actualizado',
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      this.studentService.registrar({ ...this.estudiante });

      Swal.fire({
        icon: 'success',
        title: 'Estudiante registrado',
        timer: 1200,
        showConfirmButton: false
      });
    }

    //  ACTUALIZA SIN RECARGAR
    this.cargarEstudiantes();
    this.cd.detectChanges();

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
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {

      if (!res.isConfirmed) return;

      this.studentService.eliminar(indexReal);

      
      this.listaEstudiantes = this.listaEstudiantes.filter((_, i) => i !== indexReal);

      this.cd.detectChanges(); // refresco

      if (this.editando && this.indiceEdicion === indexReal) {
        this.limpiarFormulario();
      }

      Swal.fire({
        icon: 'success',
        title: 'Estudiante eliminado',
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
      nota: 0
    };

    this.editando = false;
    this.indiceEdicion = null;
  }

  mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Revise el formulario',
      text: mensaje
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
    }).then(res => {

      if (!res.isConfirmed) return;

      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('evaluacionActiva');

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada correctamente',
        timer: 1200,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/']);
      });
    });
  }
}