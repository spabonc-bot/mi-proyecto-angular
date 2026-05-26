import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { EvaluationService } from '../../services/evaluations.service';
import { EvaluationModel } from '../../models/evaluation';
import { QuestionModel } from '../../models/question';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './questions.html',
  styleUrls: ['./questions.css']
})
export class Questions implements OnInit {

  evaluacion!: EvaluationModel;

  pregunta: QuestionModel = {
    enunciado: '',
    opcionA: '',
    opcionB: '',
    opcionC: '',
    opcionD: '',
    respuesta: '',
    tiempo: null
  };

  listaPreguntas: QuestionModel[] = [];
  editandoIndex: number = -1;

  usarTiempoPregunta: boolean = false;

  // Agregado ejercicio:
  // Tema que el docente escribe para que la IA genere preguntas.
  temaIA: string = '';

  // Agregado ejercicio:
  
  cantidadIA: number = 1;

  
  generandoIA: boolean = false;

  
  preguntasGeneradasIA: QuestionModel[] = [];

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEvaluacion();
  }

  cargarEvaluacion(): void {
    const data = this.evaluationService.getEvaluacion();

    if (!data) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay evaluación',
        text: 'Primero debes crear una evaluación'
      }).then(() => {
        this.router.navigate(['/evaluaciones']);
      });
      return;
    }

    this.evaluacion = data;

    this.listaPreguntas = [...(data.preguntas || [])].map((p: any) => ({
      enunciado: p.enunciado || '',
      opcionA: p.opcionA || '',
      opcionB: p.opcionB || '',
      opcionC: p.opcionC || '',
      opcionD: p.opcionD || '',
      respuesta: p.respuesta || '',
      tiempo:
        p.tiempo == null || p.tiempo === ''
          ? null
          : Number(p.tiempo)
    }));

    // Agregado ejercicio:
    // Ajusta la cantidad de preguntas para IA según las preguntas faltantes.
    this.sincronizarCantidadIA();

    this.cd.detectChanges();
  }

  get totalPreguntas(): number {
    return this.evaluacion?.cantidad || 0;
  }

  get preguntasCompletas(): boolean {
    return this.listaPreguntas.length === this.totalPreguntas;
  }

  // Agregado ejercicio:
  // Calcula cuántas preguntas faltan por registrar.
  get preguntasRestantes(): number {
    const restantes = this.totalPreguntas - this.listaPreguntas.length;
    return restantes > 0 ? restantes : 0;
  }


  sincronizarCantidadIA(): void {
    if (this.preguntasRestantes <= 0) {
      this.cantidadIA = 0;
      return;
    }

    if (!this.cantidadIA || this.cantidadIA <= 0) {
      this.cantidadIA = this.preguntasRestantes;
      return;
    }

    if (this.cantidadIA > this.preguntasRestantes) {
      this.cantidadIA = this.preguntasRestantes;
    }
  }

  cambiarUsoTiempo(activo: boolean): void {
    this.usarTiempoPregunta = activo;

    if (!activo) {
      this.pregunta.tiempo = null;
    }
  }

  // Agregado ejercicio:
  // Obtiene la URL correcta de la función IA.
  // En producción o netlify dev usa la ruta normal.
  // Si Angular corre con ng serve en localhost:4200,
  // llama la función de Netlify en localhost:8888.
  obtenerUrlIA(): string {
    const host = window.location.hostname;
    const port = window.location.port;

    if (host === 'localhost' && port === '4200') {
      return 'http://localhost:8888/.netlify/functions/generate-questions';
    }

    return '/.netlify/functions/generate-questions';
  }

  // Agregado ejercicio:
  // Envía el tema, tipo y cantidad a la función de Netlify.
  // La función llama a la IA y devuelve preguntas sugeridas.
  async generarPreguntasIA(): Promise<void> {
    this.sincronizarCantidadIA();

    if (this.preguntasCompletas || this.preguntasRestantes <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Preguntas completas',
        text: 'Ya completaste la cantidad de preguntas configuradas para esta evaluación.'
      });
      return;
    }

    if (!this.temaIA.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Tema requerido',
        text: 'Ingrese un tema para generar preguntas con IA.'
      });
      return;
    }

    if (!this.cantidadIA || this.cantidadIA <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Ingrese una cantidad válida de preguntas.'
      });
      return;
    }

    if (this.cantidadIA > this.preguntasRestantes) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad no permitida',
        text: `Solo faltan ${this.preguntasRestantes} pregunta(s) por registrar.`
      });

      this.cantidadIA = this.preguntasRestantes;
      return;
    }

    this.generandoIA = true;
    this.preguntasGeneradasIA = [];

    try {
      const respuesta = await fetch(this.obtenerUrlIA(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tema: this.temaIA,
          tipo: this.evaluacion.tipo,
          cantidad: this.cantidadIA
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'No se pudieron generar preguntas con IA');
      }

      const textoGenerado = String(data.preguntas || '');

      this.preguntasGeneradasIA = this.convertirTextoIAaPreguntas(textoGenerado)
        .slice(0, this.preguntasRestantes);

      if (this.preguntasGeneradasIA.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin preguntas válidas',
          text: 'La IA respondió, pero no se pudo convertir la respuesta en preguntas válidas.'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Preguntas generadas',
        text: 'La IA generó preguntas sugeridas. Revísalas antes de usarlas.',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error con IA',
        text: String(error)
      });
    } finally {
      this.generandoIA = false;
      this.cd.detectChanges();
    }
  }

  
  convertirTextoIAaPreguntas(texto: string): QuestionModel[] {
    try {
      let limpio = texto
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const inicio = limpio.indexOf('[');
      const fin = limpio.lastIndexOf(']');

      if (inicio !== -1 && fin !== -1) {
        limpio = limpio.substring(inicio, fin + 1);
      }

      const datos = JSON.parse(limpio);

      if (!Array.isArray(datos)) {
        return [];
      }

      return datos.map((p: any) => ({
        enunciado: String(p.enunciado || '').trim(),
        opcionA: String(p.opcionA || '').trim(),
        opcionB: String(p.opcionB || '').trim(),
        opcionC: String(p.opcionC || '').trim(),
        opcionD: String(p.opcionD || '').trim(),
        respuesta: String(p.respuesta || '').trim().toUpperCase(),
        tiempo: null
      }));

    } catch (error) {
      console.error('Error convirtiendo respuesta IA:', error);
      return [];
    }
  }


  usarPreguntaGenerada(preguntaIA: QuestionModel): void {
    if (this.preguntasCompletas) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Ya completaste todas las preguntas de esta evaluación.'
      });
      return;
    }

    this.pregunta = {
      enunciado: preguntaIA.enunciado || '',
      opcionA: preguntaIA.opcionA || '',
      opcionB: preguntaIA.opcionB || '',
      opcionC: preguntaIA.opcionC || '',
      opcionD: preguntaIA.opcionD || '',
      respuesta: preguntaIA.respuesta || '',
      tiempo: null
    };

    this.usarTiempoPregunta = false;
    this.editandoIndex = -1;

    Swal.fire({
      icon: 'info',
      title: 'Pregunta copiada',
      text: 'La pregunta fue copiada al formulario. Revísala y presiona Guardar pregunta.',
      timer: 1600,
      showConfirmButton: false
    });
  }

  // Agregado ejercicio:
  // Limpia las preguntas sugeridas por IA.
  limpiarPreguntasIA(): void {
    this.preguntasGeneradasIA = [];
  }

  guardarPregunta(): void {
    const errores = this.validarFormulario();

    if (errores.length) {
      Swal.fire({
        icon: 'error',
        title: 'Revise el formulario',
        html: `
          <ul style="text-align:left">
            ${errores.map(error => `<li>${error}</li>`).join('')}
          </ul>
        `
      });
      return;
    }

    if (this.editandoIndex === -1 && this.listaPreguntas.length >= this.totalPreguntas) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Ya completaste todas las preguntas configuradas para esta evaluación'
      });
      return;
    }

    if (this.editandoIndex >= 0) {
      this.listaPreguntas[this.editandoIndex] = { ...this.pregunta };
      this.mostrarExito('Pregunta actualizada correctamente');
    } else {
      this.listaPreguntas.push({ ...this.pregunta });
      this.mostrarExito('Pregunta guardada correctamente');
    }

    this.listaPreguntas = [...this.listaPreguntas];

    this.guardarEnStorage();
    this.limpiarFormulario();

    
    this.sincronizarCantidadIA();

    this.cd.detectChanges();
  }

  validarFormulario(): string[] {
    const p = this.pregunta;
    const tipo = this.evaluacion.tipo;

    p.enunciado = p.enunciado.trim();
    p.opcionA = (p.opcionA || '').trim();
    p.opcionB = (p.opcionB || '').trim();
    p.opcionC = (p.opcionC || '').trim();
    p.opcionD = (p.opcionD || '').trim();
    p.respuesta = p.respuesta.trim().toUpperCase();

    const tiempo = Number(p.tiempo);
    const tiempoVacio = p.tiempo === null;

    const reglas = [
      () => !p.enunciado && 'Ingrese la pregunta',

      () =>
        this.usarTiempoPregunta &&
        tiempoVacio &&
        'Ingrese el tiempo de la pregunta',

      () =>
        this.usarTiempoPregunta &&
        (!tiempo || tiempo <= 0) &&
        'Ingrese un tiempo válido para la pregunta',

      () =>
        this.usarTiempoPregunta &&
        tiempo > 300 &&
        'El tiempo máximo permitido por pregunta es de 300 segundos',

      () => {
        if (tipo !== 'multiple') return null;

        if (!p.opcionA || !p.opcionB || !p.opcionC || !p.opcionD) {
          return 'Complete todas las opciones';
        }

        if (!['A', 'B', 'C', 'D'].includes(p.respuesta)) {
          return 'La respuesta debe ser A, B, C o D';
        }

        return null;
      },

      () => {
        if (tipo !== 'vf') return null;

        if (!['V', 'F'].includes(p.respuesta)) {
          return 'Seleccione Verdadero o Falso';
        }

        return null;
      },

      () => {
        if (tipo !== 'abierta') return null;

        if (!p.respuesta) {
          return 'Ingrese la respuesta';
        }

        return null;
      }
    ];

    const errores = reglas
      .map(regla => regla())
      .filter(mensaje => mensaje) as string[];

    if (errores.length === 0) {
      p.tiempo = this.usarTiempoPregunta ? tiempo : null;
    }

    return errores;
  }

  guardarEnStorage(): void {
    this.evaluacion.preguntas = [...this.listaPreguntas];
    this.evaluationService.guardarEvaluacion(this.evaluacion);
  }

  limpiarFormulario(): void {
    this.pregunta = {
      enunciado: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuesta: '',
      tiempo: null
    };

    this.usarTiempoPregunta = false;
    this.editandoIndex = -1;
  }

  editarPregunta(index: number): void {
    const preguntaSeleccionada = this.listaPreguntas[index];

    this.pregunta = {
      ...preguntaSeleccionada,
      tiempo:
        preguntaSeleccionada.tiempo === null
          ? null
          : Number(preguntaSeleccionada.tiempo)
    };

    this.usarTiempoPregunta = this.pregunta.tiempo !== null;

    this.editandoIndex = index;
  }

  eliminarPregunta(index: number): void {
    Swal.fire({
      title: '¿Eliminar pregunta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;

      this.listaPreguntas = this.listaPreguntas.filter((_, i) => i !== index);

      this.guardarEnStorage();

      if (this.editandoIndex === index) {
        this.limpiarFormulario();
      }

 
      this.sincronizarCantidadIA();

      this.cd.detectChanges();

      this.mostrarExito('Pregunta eliminada correctamente');
    });
  }

  verPregunta(index: number): void {
    const p = this.listaPreguntas[index];

    let contenido = `<strong>${p.enunciado}</strong><br><br>`;

    if (this.evaluacion.tipo === 'multiple') {
      contenido += `
        A: ${p.opcionA}<br>
        B: ${p.opcionB}<br>
        C: ${p.opcionC}<br>
        D: ${p.opcionD}<br><br>
      `;
    }

    contenido += `
      <b>Respuesta:</b> ${p.respuesta}<br>
      <b>Tiempo:</b> ${p.tiempo === null ? 'Sin límite' : p.tiempo + ' segundos'}
    `;

    Swal.fire({
      title: 'Detalle de la pregunta',
      html: contenido,
      icon: 'info'
    });
  }

  finalizarEvaluacion(): void {
    if (this.listaPreguntas.length < this.totalPreguntas) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan preguntas',
        text: `Debes registrar ${this.totalPreguntas} preguntas. Actualmente tienes ${this.listaPreguntas.length}.`
      });
      return;
    }

    this.guardarEnStorage();

    Swal.fire({
      icon: 'success',
      title: 'Evaluación creada correctamente',
      text: 'La evaluación quedó lista para que los estudiantes puedan presentarla.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      localStorage.removeItem('evaluacionActiva');
      this.router.navigate(['/evaluaciones']);
    });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
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

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        timer: 1200,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/']);
      });
    });
  }

  mostrarExito(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      title: mensaje,
      timer: 1000,
      showConfirmButton: false
    });
  }
}