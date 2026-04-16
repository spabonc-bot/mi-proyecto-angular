import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  estudiante = {
    nombre: '',
    apellido: '',
    identificacion: '',
    correo: '',
    password: '',
    estado: 'activo'
  };

  constructor(private router: Router) {}

  registrarEstudiante() {
    const e = this.estudiante;

    const reglas = [
      () => !e.nombre.trim() && 'El nombre es obligatorio',
      () => !e.apellido.trim() && 'El apellido es obligatorio',
      () => !e.identificacion.trim() && 'La identificación es obligatoria',
      () => !/^[0-9]+$/.test(e.identificacion) && 'La identificación debe ser numérica',
      () => e.identificacion.length < 5 && 'La identificación debe tener mínimo 5 dígitos',
      () => !e.correo.trim() && 'El correo es obligatorio',
      () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.correo) && 'Correo inválido',
      () => !e.password.trim() && 'La contraseña es obligatoria',
      () => e.password.length < 6 && 'La contraseña debe tener mínimo 6 caracteres'
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

    const lista = JSON.parse(localStorage.getItem('estudiantes') || '[]');

    const existe = lista.some((est: any) =>
      est.identificacion === e.identificacion
    );

    if (existe) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya existe un estudiante con esa identificación'
      });
      return;
    }

    lista.push({ ...this.estudiante });
    localStorage.setItem('estudiantes', JSON.stringify(lista));

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Ahora puedes iniciar sesión'
    }).then(() => {
      this.router.navigate(['/login']);
    });

    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.estudiante = {
      nombre: '',
      apellido: '',
      identificacion: '',
      correo: '',
      password: '',
      estado: 'activo'
    };
  }

  volverLogin() {
    this.router.navigate(['/']);
  }
}
