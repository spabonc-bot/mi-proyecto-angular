import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam.html',
  styleUrls: ['./exam.css']
})
export class Exam {

  evaluacion: any = null;
  estudiante: any = null;
  respuestas: any[] = [];
  evaluacionesDisponibles: any[] = [];
  nombreUsuario: string = '';

  constructor(private router: Router) {
    this.cargarExamen();
  }

  cargarExamen(): void {
    const dataUsuario = localStorage.getItem('usuarioActivo');

    if (!dataUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'No hay sesión activa',
        text: 'Debe iniciar sesión'
      }).then(() => {
        this.router.navigate(['/']);
      });
      return;
    }

    this.estudiante = JSON.parse(dataUsuario);

    this.nombreUsuario =
      this.estudiante?.nombre ||
      this.estudiante?.data?.nombre ||
      this.estudiante?.usuario?.nombre ||
      'Usuario';

    const listaEvaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    this.evaluacionesDisponibles = listaEvaluaciones.filter(
      (e: any) => e.preguntas && e.preguntas.length > 0
    );

    const dataEvaluacion = localStorage.getItem('evaluacionActiva');

    if (dataEvaluacion) {
      this.evaluacion = JSON.parse(dataEvaluacion);

      if (!this.evaluacion.preguntas || this.evaluacion.preguntas.length === 0) {
        this.evaluacion = null;
        return;
      }

      this.respuestas = new Array(this.evaluacion.preguntas.length).fill('');
    }
  }

  seleccionarEvaluacion(evaluacion: any): void {
    this.evaluacion = evaluacion;
    localStorage.setItem('evaluacionActiva', JSON.stringify(evaluacion));
    this.respuestas = new Array(this.evaluacion.preguntas.length).fill('');
  }

  responder(index: number, valor: any): void {
    this.respuestas[index] = valor;
  }

  finalizarExamen(): void {
    if (!this.evaluacion) return;

    const sinResponder = this.respuestas.some(r => String(r).trim() === '');

    if (sinResponder) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan respuestas',
        text: 'Debes responder todas las preguntas'
      });
      return;
    }

    let correctas = 0;

    this.evaluacion.preguntas.forEach((pregunta: any, i: number) => {
      const correcta = String(pregunta.respuesta).trim().toUpperCase();
      const respondida = String(this.respuestas[i]).trim().toUpperCase();

      if (correcta === respondida) {
        correctas++;
      }
    });

    const total = this.evaluacion.preguntas.length;

    let notaMaxima = 5;
    if (this.evaluacion.escala) {
      const partes = String(this.evaluacion.escala).split('-');
      if (partes.length > 1) {
        notaMaxima = Number(partes[1].trim()) || 5;
      }
    }

    const nota = (correctas / total) * notaMaxima;

    const resultado = {
      estudiante: this.nombreUsuario,
      identificacion:
        this.estudiante?.identificacion ||
        this.estudiante?.data?.identificacion ||
        '',
      evaluacion: this.evaluacion.nombre,
      docente: this.evaluacion.docente,
      totalPreguntas: total,
      correctas: correctas,
      nota: nota.toFixed(2),
      fecha: new Date().toLocaleString()
    };

    const historial = JSON.parse(localStorage.getItem('resultados') || '[]');
    historial.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(historial));

    Swal.fire({
  icon: 'success',
  title: 'Examen finalizado',
  html: `
    <p>Has completado la evaluación correctamente.</p>
    <p><strong>Tu nota fue:</strong> ${nota.toFixed(2)}</p>
  `,
  confirmButtonText: 'Aceptar'
}).then(() => {
  localStorage.removeItem('evaluacionActiva');
  this.evaluacion = null;
  this.respuestas = [];
  this.cargarExamen();
});
  }
yaPresentoEvaluacion(evaluacion: any): boolean {
  const historial = JSON.parse(localStorage.getItem('resultados') || '[]');

  const identificacion =
    this.estudiante?.identificacion ||
    this.estudiante?.data?.identificacion ||
    '';

  return historial.some((r: any) =>
    r.identificacion === identificacion &&
    r.evaluacion === evaluacion.nombre
  );
}
  volverASeleccionar(): void {
    this.evaluacion = null;
    this.respuestas = [];
    localStorage.removeItem('evaluacionActiva');
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('evaluacionActiva');
    this.router.navigate(['/']);
  }
}