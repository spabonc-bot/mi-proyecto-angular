import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { StudentService } from '../../services/student.service';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  identificacion: string = '';
  password: string = '';
  rol: string = '';

  constructor(
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
   
    this.limpiarFormulario();
  }

  async iniciarSesion(): Promise<void> {

    
    if (!this.identificacion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Ingrese el número de identificación'
      });
      return;
    }

    
    if (!this.password.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Ingrese la contraseña'
      });
      return;
    }

    
    if (!this.rol.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Debe seleccionar un rol para continuar'
      });
      return;
    }

    // Corrección carga docentes desde JSON si el localStorage está vacío.
    await this.teacherService.inicializarDatos();

    if (this.rol === 'docente') {
      const docente = this.teacherService.buscarPorCredenciales(
        this.identificacion.trim(),
        this.password.trim()
      );

      if (!docente) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'Docente no encontrado o contraseña incorrecta'
        });
        return;
      }

      
      localStorage.setItem('usuarioActivo', JSON.stringify({
        tipo: 'docente',
        nombre: docente.nombre,
        identificacion: docente.identificacion,
        correo: docente.correo
      }));

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola, ${docente.nombre}`
      }).then(() => {
        
        this.limpiarFormulario();
        this.router.navigate(['/docentes']);
      });

      return;
    }

    if (this.rol === 'estudiante') {
      const estudiante = this.studentService.buscarPorCredenciales(
        this.identificacion.trim(),
        this.password.trim()
      );

      if (!estudiante) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'Estudiante no encontrado o contraseña incorrecta'
        });
        return;
      }

      
      localStorage.setItem('usuarioActivo', JSON.stringify({
        tipo: 'estudiante',
        nombre: estudiante.nombre,
        identificacion: estudiante.identificacion,
        correo: estudiante.correo
      }));

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola, ${estudiante.nombre}`
      }).then(() => {
        // Limpia después de iniciar sesión.
        this.limpiarFormulario();
        this.router.navigate(['/examen']);
      });

      return;
    }
  }

  limpiarFormulario(): void {
    //  borra lo escrito
    this.identificacion = '';
    this.password = '';
    this.rol = '';
  }

  irRegistro(): void {
    // Limpia el formulario antes de ir al registro.
    this.limpiarFormulario();
    this.router.navigate(['/registro']);
  }
}