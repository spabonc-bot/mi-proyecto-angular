import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class Results {

  listaResultados: any[] = [];
  filtro: string = '';

  constructor(private router: Router) {
    this.cargarResultados();
  }

  cargarResultados(): void {
    this.listaResultados = JSON.parse(localStorage.getItem('resultados') || '[]');
  }

  get resultadosFiltrados(): any[] {
    return this.listaResultados.filter(r =>
      (r.estudiante || '').toLowerCase().includes(this.filtro.toLowerCase()) ||
      (r.identificacion || '').toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  esAprobado(resultado: any): boolean {
    return Number(resultado.nota) >= 3;
  }

  obtenerEstado(resultado: any): string {
    return this.esAprobado(resultado) ? 'Aprobado' : 'Reprobado';
  }

  verReporte(resultado: any): void {
    Swal.fire({
      title: 'Centro de reportes',
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Estudiante:</strong> ${resultado.estudiante || 'No registrado'}</p>
          <p><strong>Identificación:</strong> ${resultado.identificacion || 'No registrada'}</p>
          <p><strong>Evaluación:</strong> ${resultado.evaluacion || 'No registrada'}</p>
          <p><strong>Docente:</strong> ${resultado.docente || 'No registrado'}</p>
          <p><strong>Correctas:</strong> ${resultado.correctas ?? 0}</p>
          <p><strong>Total preguntas:</strong> ${resultado.totalPreguntas ?? 0}</p>
          <p><strong>Nota:</strong> ${resultado.nota ?? 0}</p>
          <p><strong>Fecha:</strong> ${resultado.fecha || 'No registrada'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
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
    }
}