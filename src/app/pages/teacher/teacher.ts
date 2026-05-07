import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🔥 agregado ChangeDetectorRef
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
    private teacherService: TeacherService,
    private cd: ChangeDetectorRef // refresco visual
  ) {}

  async ngOnInit(): Promise<void> {
    await this.teacherService.inicializarDatos();
    this.cargarDocentes();
  }

  cargarDocentes(): void {
   
    this.listaDocentes = [...this.teacherService.getDocentes()];
    this.cd.detectChanges();
  }

  validarFormulario(): string | null {
    const d = this.docente;

   
    d.nombre = d.nombre.trim();
    d.identificacion = d.identificacion.trim();
    d.correo = d.correo.trim();
    d.titulo = d.titulo.trim();
    d.password = d.password.trim();

    const reglas = [
      () => !d.nombre && 'El nombre completo es obligatorio',
      () => d.nombre && d.nombre.length < 3 && 'El nombre completo debe tener mínimo 3 caracteres',

      () => {
        
        // Se agrupan las validaciones de identificación para mostrar solo un error claro.
        if (!d.identificacion) return 'La identificación es obligatoria';
        if (!/^[0-9]+$/.test(d.identificacion)) return 'La identificación solo debe contener números';
        if (d.identificacion.length < 5) return 'La identificación debe tener mínimo 5 dígitos';
        return null;
      },
      
      () => {
        // Se agrupan las validaciones de correo para no saturar la alerta.
        if (!d.correo) return 'El correo es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)) return 'El correo no tiene un formato válido';
        return null;
      },

      () => {
        if (!d.titulo) return 'El título profesional es obligatorio';
        return null;
      },

      () => {
        // Se agrupan las validaciones de contraseña para mostrar un solo mensaje.
        if (!d.password) return 'La contraseña es obligatoria';
        if (d.password.length < 6) return 'La contraseña debe tener mínimo 6 caracteres';
        return null;
      },

      () => {
        // Ahora valida al editar
        const duplicado = this.listaDocentes.some((doc, index) =>
          doc.identificacion === d.identificacion &&
          index !== this.indiceEdicion
        );

        return duplicado && 'Ya existe otro docente con esa identificación';
      }
    ];

    // Se devuelve solo el primer error encontrado para evitar una alerta demasiado larga.
    for (const regla of reglas) {
      const error = regla();
      if (error) return error;
    }

    return null;
  }

  guardarDocente(): void {
    const error = this.validarFormulario();

    if (error) {
      this.mostrarError(error);
      return;
    }

    if (this.editando && this.indiceEdicion !== null) {
      this.teacherService.actualizar(this.indiceEdicion, { ...this.docente });
      this.mostrarExito('Docente actualizado correctamente');
    } else {
      this.teacherService.agregar({ ...this.docente });
      this.mostrarExito('Docente guardado correctamente');
    }

    this.limpiarFormulario();
    this.cargarDocentes(); 
  }

  editarDocente(index: number): void {
    this.docente = { ...this.listaDocentes[index] };
    this.editando = true;
    this.indiceEdicion = index;

    this.mostrarInfo(`Editando a ${this.docente.nombre}`);
  }

  eliminarDocente(index: number): void {
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

 
      this.listaDocentes = this.listaDocentes.filter((_, i) => i !== index);

      if (this.editando && this.indiceEdicion === index) {
        this.limpiarFormulario();
      }

      this.cd.detectChanges();  

      this.mostrarExito('Docente eliminado correctamente');
    });
  }

  cancelar(): void {
    if (!this.editando) {
      this.limpiarFormulario();
      return;
    }

    Swal.fire({
      title: 'Cancelar edición',
      text: 'Se perderán los cambios',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        this.limpiarFormulario();
      }
    });
  }

  limpiarFormulario(): void {
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

  mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  mostrarInfo(mensaje: string): void {
    Swal.fire({
      icon: 'info',
      title: mensaje,
      timer: 1200,
      showConfirmButton: false
    });
  }
}