import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results {

  
  resultados: any[] = [
    { nombre: 'Juan', apellido: 'Peréz', id: '1234567', nota: 4.5 },
    { nombre: 'Ariana', apellido: 'Gómez', id: '0123456', nota: 2.8 },
    { nombre: 'Daniel', apellido: 'londoño', id: '2345678', nota: 5.0 }
  ];

  busqueda: string = '';

  
  get resultadosFiltrados() {
    return this.resultados.filter(r =>
      r.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      r.id.includes(this.busqueda)
    );
  }
}