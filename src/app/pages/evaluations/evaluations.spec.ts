import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './evaluations.html',
  styleUrl: './evaluations.css'
})
export class Evaluations {

  nombreEvaluacion = "";
  tipoPreguntas = "";
  cantidadPreguntas = 0;
  escalaSeleccionada = "";
  docenteSeleccionado = "";

  crearEvaluacion(){

    console.log("Evaluación creada");

    console.log("Nombre:", this.nombreEvaluacion);
    console.log("Tipo:", this.tipoPreguntas);
    console.log("Cantidad:", this.cantidadPreguntas);
    console.log("Escala:", this.escalaSeleccionada);
    console.log("Docente:", this.docenteSeleccionado);

  }

}
