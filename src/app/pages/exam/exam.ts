import { Component, HostListener, OnDestroy, signal } from '@angular/core';
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
export class Exam implements OnDestroy {

  evaluacion: any = null;
  estudiante: any = null;
  respuestas: any[] = [];
  evaluacionesDisponibles: any[] = [];
  nombreUsuario: string = '';

  evaluacionBloqueada: boolean = false;
  preguntaActual: number = 0;

  tiempoRestante = signal<number | null>(null);

  temporizador: any = null;

  constructor(private router: Router) {
    this.cargarExamen();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  cargarExamen(): void {
    this.detenerTemporizador();

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

<<<<<<< HEAD
    const usuarioActivo = JSON.parse(dataUsuario);

    // Agregado ejercicio:
    this.estudiante = this.obtenerEstudianteCompleto(usuarioActivo);
=======
    this.estudiante = JSON.parse(dataUsuario);
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa

    this.nombreUsuario =
      this.estudiante?.nombre ||
      this.estudiante?.data?.nombre ||
      this.estudiante?.usuario?.nombre ||
      'Usuario';

<<<<<<< HEAD
=======
    const listaEvaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');

    this.evaluacionesDisponibles = listaEvaluaciones.filter(
      (e: any) => e.preguntas && e.preguntas.length > 0
    );

>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa
    localStorage.removeItem('evaluacionActiva');

    this.evaluacion = null;
    this.respuestas = [];
    this.preguntaActual = 0;
    this.tiempoRestante.set(null);
    this.evaluacionBloqueada = false;
<<<<<<< HEAD

    // Agregado ejercicio:
    this.cargarEvaluacionesDisponibles();
  }

  // Agregado ejercicio:
  obtenerEstudianteCompleto(usuarioActivo: any): any {
    const identificacionUsuario = this.normalizar(
      usuarioActivo?.identificacion ||
      usuarioActivo?.data?.identificacion ||
      usuarioActivo?.usuario?.identificacion ||
      ''
    );

    const listaEstudiantes = JSON.parse(localStorage.getItem('estudiantes') || '[]');

    const estudianteEncontrado = listaEstudiantes.find((estudiante: any) =>
      this.normalizar(estudiante.identificacion) === identificacionUsuario
    );

    if (estudianteEncontrado) {
      return estudianteEncontrado;
    }

    return usuarioActivo;
  }

  // Agregado ejercicio:
  cargarEvaluacionesDisponibles(): void {
    const listaEvaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');

    const identificacionEstudiante = this.normalizar(
      this.estudiante?.identificacion ||
      this.estudiante?.data?.identificacion ||
      this.estudiante?.usuario?.identificacion ||
      ''
    );

    const cursoEstudiante = this.normalizar(
      this.estudiante?.curso ||
      this.estudiante?.data?.curso ||
      this.estudiante?.usuario?.curso ||
      ''
    );

    this.evaluacionesDisponibles = listaEvaluaciones.filter((evaluacion: any) => {
      const tienePreguntas =
        evaluacion.preguntas &&
        evaluacion.preguntas.length > 0;

      const asignadaAlEstudiante =
        evaluacion.asignacionTipo === 'estudiante' &&
        this.normalizar(evaluacion.estudianteAsignado) === identificacionEstudiante;

      const asignadaAlCurso =
        evaluacion.asignacionTipo === 'curso' &&
        this.normalizar(evaluacion.cursoAsignado) === cursoEstudiante;

      return tienePreguntas && (asignadaAlEstudiante || asignadaAlCurso);
    });

    // Agregado ejercicio:
    console.log('Estudiante activo completo:', this.estudiante);
    console.log('Identificación estudiante:', identificacionEstudiante);
    console.log('Curso estudiante:', cursoEstudiante);
    console.log('Todas las evaluaciones:', listaEvaluaciones);
    console.log('Evaluaciones disponibles:', this.evaluacionesDisponibles);
  }

  
  normalizar(valor: any): string {
    return String(valor || '').trim().toLowerCase();
=======
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa
  }

  seleccionarEvaluacion(evaluacion: any): void {
    if (this.yaPresentoEvaluacion(evaluacion)) return;

    this.detenerTemporizador();

    this.evaluacion = evaluacion;
    this.evaluacionBloqueada = false;
    this.preguntaActual = 0;
    this.tiempoRestante.set(null);

    localStorage.setItem('evaluacionActiva', JSON.stringify(evaluacion));

    this.respuestas = new Array(this.evaluacion.preguntas.length).fill('');

    this.iniciarTemporizador();
  }

  responder(index: number, valor: any): void {
    this.respuestas[index] = valor;
  }

  iniciarTemporizador(): void {
    this.detenerTemporizador();

    if (!this.evaluacion) return;

    const pregunta = this.evaluacion.preguntas[this.preguntaActual];
    const tiempo = Number(pregunta?.tiempo);

<<<<<<< HEAD
=======
    // Si la pregunta no tiene tiempo, queda sin límite.
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa
    if (!tiempo || tiempo <= 0) {
      this.tiempoRestante.set(null);
      return;
    }

<<<<<<< HEAD
=======
    // Muestra el tiempo inicial de la pregunta.
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa
    this.tiempoRestante.set(tiempo);

    this.temporizador = setInterval(() => {
      const tiempoActual = this.tiempoRestante();

      if (tiempoActual === null) return;

      const nuevoTiempo = tiempoActual - 1;

      this.tiempoRestante.set(nuevoTiempo);

      if (nuevoTiempo <= 0) {
        this.tiempoAgotado();
      }
    }, 1000);
  }

  detenerTemporizador(): void {
    if (this.temporizador) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  tiempoAgotado(): void {
    this.detenerTemporizador();

    if (!String(this.respuestas[this.preguntaActual] || '').trim()) {
      this.respuestas[this.preguntaActual] = 'SIN_RESPONDER';
    }

    Swal.fire({
      icon: 'warning',
      title: 'Tiempo agotado',
      text: 'Se terminó el tiempo para esta pregunta.',
      timer: 1200,
      showConfirmButton: false
    }).then(() => {
      this.siguientePregunta(true);
    });
  }

  siguientePregunta(porTiempo: boolean = false): void {
    if (!this.evaluacion) return;

    if (!porTiempo && !String(this.respuestas[this.preguntaActual] || '').trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Respuesta requerida',
        text: 'Debe responder esta pregunta antes de continuar.'
      });
      return;
    }

    if (this.preguntaActual < this.evaluacion.preguntas.length - 1) {
      this.preguntaActual++;
      this.iniciarTemporizador();
      return;
    }

    this.finalizarExamen(true);
  }

  @HostListener('document:visibilitychange')
  detectarCambioDePestana(): void {
    if (!this.evaluacion) return;
    if (this.evaluacionBloqueada) return;

    if (document.hidden) {
      this.evaluacionBloqueada = true;
      this.anularEvaluacionPorCambioDePestana();
    }
  }

  anularEvaluacionPorCambioDePestana(): void {
    this.detenerTemporizador();

    const total = this.evaluacion?.preguntas?.length || 0;

    const resultado = {
      estudiante: this.nombreUsuario,
      identificacion:
        this.estudiante?.identificacion ||
        this.estudiante?.data?.identificacion ||
        '',
      evaluacion: this.evaluacion.nombre,
      docente: this.evaluacion.docente,
      totalPreguntas: total,
      correctas: 0,
      nota: 0,
      estado: 'Anulado por cambio de pestaña',
      fecha: new Date().toLocaleString()
    };

    const historial = JSON.parse(localStorage.getItem('resultados') || '[]');
    historial.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(historial));

    localStorage.removeItem('evaluacionActiva');

    this.evaluacion = null;
    this.respuestas = [];
    this.preguntaActual = 0;
    this.tiempoRestante.set(null);

    Swal.fire({
      icon: 'warning',
      title: 'Evaluación anulada',
      text: 'Cambiaste de pestaña durante la evaluación. La evaluación fue cerrada y no podrás presentarla nuevamente.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.cargarExamen();
    });
  }

  finalizarExamen(automatico: boolean = false): void {
    if (!this.evaluacion) return;

    if (!automatico) {
      const sinResponder = this.respuestas.some(r => String(r).trim() === '');

      if (sinResponder) {
        Swal.fire({
          icon: 'warning',
          title: 'Faltan respuestas',
          text: 'Debes responder todas las preguntas'
        });
        return;
      }
    }

    this.detenerTemporizador();

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
      nota: Number(nota.toFixed(2)),
      estado: Number(nota.toFixed(2)) >= 3 ? 'Aprobado' : 'Reprobado',
      fecha: new Date().toLocaleString()
    };

    const historial = JSON.parse(localStorage.getItem('resultados') || '[]');
    historial.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(historial));

    this.evaluacionBloqueada = true;

    Swal.fire({
      icon: 'success',
      title: automatico ? 'Examen finalizado automáticamente' : 'Examen finalizado',
      html: `
        <p>Has completado la evaluación correctamente.</p>
        <p><strong>Tu nota fue:</strong> ${nota.toFixed(2)}</p>
      `,
      confirmButtonText: 'Aceptar'
    }).then(() => {
      localStorage.removeItem('evaluacionActiva');

      this.evaluacion = null;
      this.respuestas = [];
      this.preguntaActual = 0;
      this.tiempoRestante.set(null);

<<<<<<< HEAD
      // Agregado ejercicio:
    
      this.cargarEvaluacionesDisponibles();
=======
      const listaEvaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');

      this.evaluacionesDisponibles = listaEvaluaciones.filter(
        (e: any) => e.preguntas && e.preguntas.length > 0
      );
>>>>>>> d0b5683ecefeaa510c81442014441b2d06f7acaa

      this.evaluacionBloqueada = false;
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
    this.detenerTemporizador();

    this.evaluacion = null;
    this.respuestas = [];
    this.preguntaActual = 0;
    this.tiempoRestante.set(null);
    this.evaluacionBloqueada = false;

    localStorage.removeItem('evaluacionActiva');
  }

  confirmarAbandonarExamen(): void {
    Swal.fire({
      title: 'Abandonar examen',
      text: 'Si abandonas el examen, se perderán las respuestas no enviadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, abandonar',
      cancelButtonText: 'Continuar examen'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.volverASeleccionar();
    });
  }

  confirmarCerrarSesion(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Deseas cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.cerrarSesion();
    });
  }

  cerrarSesion(): void {
    this.detenerTemporizador();

    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('evaluacionActiva');

    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      timer: 1200,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/']);
    });
  }
}