import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class Teacher {

  docente = {
    nombre: '',
    identificacion: '',
    correo: '',
    titulo: '',
    password: '',
    estado: 'activo'
  };

  listaDocentes: any[] = [];

  editando = false;
  indiceEdicion: number | null = null;

  constructor(private router: Router) {
    this.cargarDocentes();
  }

  
  cargarDocentes() {
    this.listaDocentes = JSON.parse(localStorage.getItem('docentes') || '[]');
  }

  
  validarFormulario(): string[] {
    const errores: string[] = [];

    !this.docente.nombre && errores.push('El nombre es obligatorio');
    !this.docente.identificacion && errores.push('La identificación es obligatoria');
    !this.docente.correo && errores.push('El correo es obligatorio');

    !/^[0-9]+$/.test(this.docente.identificacion) &&
      errores.push('La identificación debe ser numérica');

    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.docente.correo) &&
      errores.push('El correo no es válido');

    this.docente.password.length < 6 &&
      errores.push('La contraseña debe tener al menos 6 caracteres');

    !this.editando &&
      this.listaDocentes.some(d => d.identificacion === this.docente.identificacion) &&
      errores.push('Ya existe un docente con esa identificación');

    return errores;
  }

  
  guardarDocente() {
    const errores = this.validarFormulario();

    if (errores.length) {
      this.mostrarError(errores.join('\n'));
      return;
    }

    this.editando
      ? this.listaDocentes[this.indiceEdicion!] = { ...this.docente }
      : this.listaDocentes.push({ ...this.docente });

    localStorage.setItem('docentes', JSON.stringify(this.listaDocentes));

    this.limpiarFormulario();

    this.mostrarExito(
      this.editando ? 'Docente actualizado correctamente' : 'Docente guardado correctamente'
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

      this.listaDocentes.splice(index, 1);
      localStorage.setItem('docentes', JSON.stringify(this.listaDocentes));

      this.editando && this.indiceEdicion === index && this.limpiarFormulario();

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
      res.isConfirmed && this.limpiarFormulario();
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
}
