import { Routes } from '@angular/router';
import { Companies } from './components/companies/companies';

export const routes: Routes = [
  { path: '', redirectTo: '/empresas', pathMatch: 'full' },
  { path: 'empresas', component: Companies },
  { path: '**', redirectTo: '/empresas' }
];
