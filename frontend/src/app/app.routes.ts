import { Routes } from '@angular/router';
import { Companies } from './components/companies/companies';
import { CompanyDetails } from './components/company-details/company-details';

export const routes: Routes = [
  { path: '', redirectTo: '/empresas', pathMatch: 'full' },
  { path: 'empresas', component: Companies },
  { path: 'empresas/:id', component: CompanyDetails },
  { path: '**', redirectTo: '/empresas' }
];
