import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
=======
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ScaleService } from '../../services/scale.service';
import { ScaleModel } from '../../models/scales';
>>>>>>> 301906fa262fcb1aa87e932978248093548adada

@Component({
  selector: 'app-scale',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, FormsModule],
=======
  imports: [CommonModule, FormsModule, RouterModule],
>>>>>>> 301906fa262fcb1aa87e932978248093548adada
  templateUrl: './scale.html',
  styleUrls: ['./scale.css']
})
export class Scale {
<<<<<<< HEAD
  nombre: string = '';
  notaMin: number | null = null;
  notaMax: number | null = null;
  mostrarFormulario: boolean = false;
  editarEscalaId: number | null = null;

  escalas = [
    { id: 1, nombre: '0 - 5', notaMin: 0, notaMax: 5 },
    { id: 2, nombre: '0 - 100', notaMin: 0, notaMax: 100 }
  ];

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  guardarEscala() {
    if (this.nombre && this.notaMin !== null && this.notaMax !== null) {
      if (this.editarEscalaId) {
        const index = this.escalas.findIndex(e => e.id === this.editarEscalaId);
        this.escalas[index] = { id: this.editarEscalaId, nombre: this.nombre, notaMin: this.notaMin, notaMax: this.notaMax };
      } else {
        const nuevoId = this.escalas.length > 0 ? Math.max(...this.escalas.map(e => e.id)) + 1 : 1;
        this.escalas.push({ id: nuevoId, nombre: this.nombre, notaMin: this.notaMin, notaMax: this.notaMax });
      }
      this.cancelar();
    }
  }

  editarEscala(escala: any) {
    this.editarEscalaId = escala.id;
    this.nombre = escala.nombre;
    this.notaMin = escala.notaMin;
    this.notaMax = escala.notaMax;
    this.mostrarFormulario = true;
  }

  eliminarEscala(id: number) {
    this.escalas = this.escalas.filter(e => e.id !== id);
  }

  cancelar() {
    this.nombre = '';
    this.notaMin = null;
    this.notaMax = null;
    this.editarEscalaId = null;
    this.mostrarFormulario = false;
=======
  busqueda: string = '';
  editando: boolean = false;
  indexEditando: number = -1;

  nuevaEscala: ScaleModel = {
    nombre: '',
    min: 0,
    max: 0
  };

 constructor(
  private scaleService: ScaleService,
  private router: Router
) {}

  get escalas(): ScaleModel[] {
    return this.scaleService.getEscalas();
  }

  get escalasFiltradas(): ScaleModel[] {
    return this.escalas.filter(escala =>
      escala.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  agregarEscala(): void {
    const nombre = this.nuevaEscala.nombre.trim();

    if (!nombre) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Por favor, ingresa un nombre para la escala'
      });
      return;
    }

    if (this.nuevaEscala.min >= this.nuevaEscala.max) {
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: 'La nota mínima debe ser menor que la nota máxima'
      });
      return;
    }

    const nombreExiste = this.escalas.some((escala, index) =>
      escala.nombre.toLowerCase() === nombre.toLowerCase() &&
      index !== this.indexEditando
    );

    if (nombreExiste) {
      Swal.fire({
        icon: 'warning',
        title: 'Escala duplicada',
        text: 'Ya existe una escala con ese nombre'
      });
      return;
    }

    const escalaGuardar: ScaleModel = {
      nombre: nombre,
      min: Number(this.nuevaEscala.min),
      max: Number(this.nuevaEscala.max)
    };

    if (this.editando) {
      this.scaleService.actualizarEscala(this.indexEditando, escalaGuardar);
      this.editando = false;
      this.indexEditando = -1;

      Swal.fire({
        icon: 'success',
        title: 'Escala actualizada',
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      this.scaleService.agregarEscala(escalaGuardar);

      Swal.fire({
        icon: 'success',
        title: 'Escala guardada',
        timer: 1200,
        showConfirmButton: false
      });
    }

    this.nuevaEscala = {
      nombre: '',
      min: 0,
      max: 0
    };
  }

  editarEscala(escala: ScaleModel): void {
    this.editando = true;
    this.indexEditando = this.escalas.indexOf(escala);
    this.nuevaEscala = { ...escala };
  }

  eliminarEscala(escala: ScaleModel): void {
    Swal.fire({
      title: `¿Deseas eliminar la escala "${escala.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const index = this.escalas.indexOf(escala);

        if (index !== -1) {
          this.scaleService.eliminarEscala(index);

          Swal.fire({
            icon: 'success',
            title: 'Escala eliminada',
            timer: 1000,
            showConfirmButton: false
          });
        }
      }
    });
  }
  cerrarSesion(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Desea salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
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
>>>>>>> 301906fa262fcb1aa87e932978248093548adada
  }
}