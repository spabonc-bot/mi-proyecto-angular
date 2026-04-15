import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scale.html',
  styleUrl: './scale.css'
})
export class Scale {
  busqueda: string = '';
  editando: boolean = false;
  indexEditando: number = -1;

  nuevaEscala = { nombre: '', min: 0, max: 0 };
  
  escalas = [
    { nombre: '0 - 5', min: 0, max: 5 },
    { nombre: '0 - 100', min: 0, max: 100 },
    { nombre: '0-100', min: 0, max: 100 },
    { nombre: '0-50', min: 0, max: 50 }
  ];

  // Filtro de búsqueda
  get escalasFiltradas() {
    return this.escalas.filter(e => 
      e.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  // Agregar o Actualizar escala
  agregarEscala() {
    if (this.nuevaEscala.nombre.trim() !== '') {
      if (this.editando) {
        // Si estamos editando, reemplazamos en la posición guardada
        this.escalas[this.indexEditando] = { ...this.nuevaEscala };
        this.editando = false;
        this.indexEditando = -1;
      } else {
        // Si es nueva, la añadimos al arreglo
        this.escalas.push({ ...this.nuevaEscala });
      }
      // Limpiamos el formulario
      this.nuevaEscala = { nombre: '', min: 0, max: 0 };
    } else {
      alert('Por favor, ingresa un nombre para la escala');
    }
  }

  // Cargar datos en el formulario para editar
  editarEscala(escala: any) {
    this.editando = true;
    this.indexEditando = this.escalas.indexOf(escala);
    this.nuevaEscala = { ...escala };
  }

  // Eliminar escala de la lista
  eliminarEscala(escala: any) {
    const confirmar = confirm(`¿Estás segura de eliminar la escala "${escala.nombre}"?`);
    if (confirmar) {
      this.escalas = this.escalas.filter(e => e !== escala);
    }
  }
}