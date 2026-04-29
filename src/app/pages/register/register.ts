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

  registrarEstudiante(): void {
    // limpian espacios antes de validar 
    this.estudiante.nombre = this.estudiante.nombre.trim();
    this.estudiante.apellido = this.estudiante.apellido.trim();
    this.estudiante.identificacion = this.estudiante.identificacion.trim();
    this.estudiante.correo = this.estudiante.correo.trim();
    this.estudiante.password = this.estudiante.password.trim();

    const e = this.estudiante;

    const reglas = [
  () => !e.nombre && 'El nombre es obligatorio',
  () => !e.apellido && 'El apellido es obligatorio',

  () => {
    if (!e.identificacion) return 'La identificación es obligatoria';
    if (!/^[0-9]+$/.test(e.identificacion)) return 'La identificación debe ser numérica';
    if (e.identificacion.length < 5) return 'La identificación debe tener mínimo 5 dígitos';
    return null;
  },

  () => {
    if (!e.correo) return 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.correo)) return 'Correo inválido';
    return null;
  },

  () => {
    if (!e.password) return 'La contraseña es obligatoria';
    if (e.password.length < 6) return 'La contraseña debe tener mínimo 6 caracteres';
    return null;
  }
];

    const errores = reglas
      .map(r => r())
      .filter(mensaje => mensaje) as string[];

    if (errores.length) {
      Swal.fire({
        icon: 'error',
        title: 'Revise los campos',
        // saturacion errores
        html: `
          <ul style="text-align:left">
            ${errores.map(error => `<li>${error}</li>`).join('')}
          </ul>
        `
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
        title: 'Identificación duplicada',
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
      
      this.limpiarFormulario();
      this.router.navigate(['/']);
    });
  }

  limpiarFormulario(): void {
    
    this.estudiante = {
      nombre: '',
      apellido: '',
      identificacion: '',
      correo: '',
      password: '',
      estado: 'activo'
    };
  }

  volverLogin(): void {
    
    this.limpiarFormulario();
    this.router.navigate(['/']);
  }
}