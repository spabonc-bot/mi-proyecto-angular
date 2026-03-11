import { Routes } from '@angular/router';
import { Scale } from './pages/scale/scale';
import { ResultsComponent } from './pages/results/results';

export const routes: Routes = [
  { path: 'escalas', component: Scale },
  { path: 'resultados', component: ResultsComponent },
  { path: '', redirectTo: '/escalas', pathMatch: 'full' }
]