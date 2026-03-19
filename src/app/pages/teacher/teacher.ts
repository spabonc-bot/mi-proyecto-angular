import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  imports: [],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css',
})
export class Teacher {
  nombre: string = '';
  identificacion: string = '';
  correo: string = '';
  titulo: string = '';
  password: string = '';
  estado: string = 'activo';

  errorNombre: string = '';
  errorIdentificacion: string ='';
  errorCorreo: string = '';
  errorPassword: string = '';


  validarTodo (){
    let valido  = true;


    
  if (this.nombre.trim() === '') {
    this.errorNombre = 'El nombre es obligatorio';
    valido = false;
  }

  if (this.nombre.trim() !== '' && this.nombre.length < 3) {
    this.errorNombre = 'Mínimo 3 caracteres';
    valido = false;
  }

  if (this.nombre.length > 50) {
    this.errorNombre = 'Máximo 50 caracteres';
    valido = false;
  }


  
  if (this.identificacion.trim() === '') {
    this.errorIdentificacion = 'La identificación es obligatoria';
    valido = false;
  }

  if (!/^[0-9]+$/.test(this.identificacion)) {
    this.errorIdentificacion = 'Solo números';
    valido = false;
  }

  if (this.identificacion.length < 5) {
    this.errorIdentificacion = 'Mínimo 5 dígitos';
    valido = false;
  }

  if (this.identificacion.length > 15) {
    this.errorIdentificacion = 'Máximo 15 dígitos';
    valido = false;
  }


  
  if (this.correo.trim() === '') {
    this.errorCorreo = 'El correo es obligatorio';
    valido = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) {
    this.errorCorreo = 'Correo inválido';
    valido = false;
  }


  
  if (this.titulo.trim() === '') {
    alert('El título profesional es obligatorio');
    valido = false;
  }

  if (this.titulo.length < 3) {
    alert('El título debe tener mínimo 3 caracteres');
    valido = false;
  }


 
  if (this.password.trim() === '') {
    this.errorPassword = 'La contraseña es obligatoria';
    valido = false;
  }

  if (this.password.length < 6) {
    this.errorPassword = 'Mínimo 6 caracteres';
    valido = false;
  }

  if (!/[A-Z]/.test(this.password)) {
    this.errorPassword = 'Debe tener al menos una mayuscula';
    valido = false;
  }

  if (!/[0-9]/.test(this.password)) {
    this.errorPassword = 'Debe tener al menos un número';
    valido = false;
  }


 
  if (this.estado !== 'activo' && this.estado !== 'inactivo') {
    alert('Seleccione un estado válido');
    valido = false;
  }

  return valido;
}
  

}
