import { Routes } from '@angular/router';
<<<<<<< HEAD
import { Scale } from './pages/scale/scale';
import { ResultsComponent } from './pages/results/results';

export const routes: Routes = [
  { path: 'escalas', component: Scale },
  { path: 'resultados', component: ResultsComponent },
  { path: '', redirectTo: '/escalas', pathMatch: 'full' }
=======
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Evaluations } from './pages/evaluations/evaluations';
import { Questions } from './pages/questions/questions';
import { Results } from './pages/results/results';
import { Scale } from './pages/scale/scale';
import { Exam } from './pages/exam/exam';


export const routes: Routes = [
   { path: '', component: Login },
   { path: 'registro', component: Register },
   { path: 'estudiantes', component: Student },
   { path: 'docentes', component:Teacher},
   { path: 'evaluaciones', component:Evaluations},
   { path: 'preguntas', component: Questions},
   { path: 'resultados', component:Results},
   { path: 'escalas', component:Scale},
   { path: 'examen', component: Exam },
>>>>>>> 301906fa262fcb1aa87e932978248093548adada
]