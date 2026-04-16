import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  identificacion: string = '';
  password: string = '';
  rol: string = '';

  constructor(private router: Router) {}

  iniciarSesion() {

    if (!this.identificacion || !this.password || !this.rol) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Complete todos los campos'
      });
      return;
    }

    // LOGIN DOCENTE
    if (this.rol === 'docente') {
      const docentes = JSON.parse(localStorage.getItem('docentes') || '[]');

      const docente = docentes.find((d: any) =>
        d.identificacion === this.identificacion &&
        d.password === this.password
      );

      if (!docente) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Docente no encontrado o contraseña incorrecta'
        });
        return;
      }

      localStorage.setItem('usuarioActivo', JSON.stringify({
        tipo: 'docente',
        data: docente
      }));

      this.router.navigate(['/docentes']);
      return;
    }

    // LOGIN ESTUDIANTE
    if (this.rol === 'estudiante') {
      const estudiantes = JSON.parse(localStorage.getItem('estudiantes') || '[]');

      const estudiante = estudiantes.find((e: any) =>
        e.identificacion === this.identificacion &&
        e.password === this.password
      );

      if (!estudiante) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Estudiante no encontrado o contraseña incorrecta'
        });
        return;
      }

      localStorage.setItem('usuarioActivo', JSON.stringify({
        tipo: 'estudiante',
        data: estudiante
      }));

      this.router.navigate(['/examen']);
      return;
    }
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}