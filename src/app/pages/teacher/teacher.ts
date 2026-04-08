import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { TeacherService } from '../../services/teacher.service';
import { TeacherModel } from '../../models/teacher';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class Teacher implements OnInit {

  docente: TeacherModel = {
    nombre: '',
    identificacion: '',
    correo: '',
    titulo: '',
    password: '',
    estado: 'activo'
  };

  listaDocentes: TeacherModel[] = [];

  editando = false;
  indiceEdicion: number | null = null;

  constructor(
  private router: Router,
  private teacherService: TeacherService
) {}

  cargarDocentes() {
    this.listaDocentes = this.teacherService.getDocentes();
  }

  validarFormulario(): string[] {
    const d = this.docente;

    const reglas = [
      () => !d.nombre && 'El nombre es obligatorio',
      () => d.nombre.length < 3 && 'Nombre mínimo 3 caracteres',

      () => !d.identificacion && 'Identificación obligatoria',
      () => !/^[0-9]+$/.test(d.identificacion) && 'Solo números',

      () => !d.correo && 'Correo obligatorio',
      () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo) && 'Correo inválido',

      () => !d.password && 'Contraseña obligatoria',
      () => d.password.length < 6 && 'Mínimo 6 caracteres',

      () =>
        !this.editando &&
        this.teacherService.existeIdentificacion(d.identificacion) &&
        'Ya existe un docente con esa identificación'
    ];

    return reglas
      .map(r => r())
      .filter(m => m) as string[];
  }

  guardarDocente() {
    const errores = this.validarFormulario();

    if (errores.length) {
      this.mostrarError(errores.join('\n'));
      return;
    }

    if (this.editando) {
      this.teacherService.actualizar(this.indiceEdicion!, this.docente);
    } else {
      this.teacherService.agregar(this.docente);
    }

    this.cargarDocentes();
    this.limpiarFormulario();

    this.mostrarExito(
      this.editando
        ? 'Docente actualizado correctamente'
        : 'Docente guardado correctamente'
    );
  }

  editarDocente(index: number) {
    this.docente = { ...this.listaDocentes[index] };
    this.editando = true;
    this.indiceEdicion = index;

    this.mostrarInfo(`Editando a ${this.docente.nombre}`);
  }

  eliminarDocente(index: number) {
    Swal.fire({
      title: '¿Eliminar docente?',
      text: `Se eliminará a ${this.listaDocentes[index].nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.teacherService.eliminar(index);

      this.cargarDocentes();

      if (this.editando && this.indiceEdicion === index) {
        this.limpiarFormulario();
      }

      this.mostrarExito('Docente eliminado correctamente');
    });
  }

  cancelar() {
    if (!this.editando) return this.limpiarFormulario();

    Swal.fire({
      title: 'Cancelar edición',
      text: 'Se perderán los cambios',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) this.limpiarFormulario();
    });
  }

  limpiarFormulario() {
    this.docente = {
      nombre: '',
      identificacion: '',
      correo: '',
      titulo: '',
      password: '',
      estado: 'activo'
    };

    this.editando = false;
    this.indiceEdicion = null;
  }

  cerrarSesion() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Desea salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.mostrarExito('Sesión cerrada').then(() => {
        this.router.navigate(['/']);
      });
    });
  }

  mostrarExito(mensaje: string) {
    return Swal.fire({
      icon: 'success',
      title: mensaje,
      timer: 1500,
      showConfirmButton: false
    });
  }

  mostrarError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  mostrarInfo(mensaje: string) {
    Swal.fire({
      icon: 'info',
      title: mensaje,
      timer: 1200,
      showConfirmButton: false
    });
  }
  async ngOnInit(): Promise<void> {
  await this.teacherService.inicializarDatos();
  this.cargarDocentes();
}
}