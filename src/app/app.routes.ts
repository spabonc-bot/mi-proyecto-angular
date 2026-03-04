import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Evaluations } from './pages/evaluations/evaluations';
import { Results } from './pages/results/results';
import { Scale } from './pages/scale/scale';

export const routes: Routes = [
   { path: '', component: Login },
   { path: 'registro', component: Register },
   { path: 'estudiantes', component: Student },
   { path: 'docentes', component:Teacher},
   { path: 'evaluaciones', component:Evaluations},
   { path: 'resultados', component:Results},
   { path: 'escalas', component:Scale},
]