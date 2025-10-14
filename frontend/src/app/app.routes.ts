import { Routes } from '@angular/router';
import { Companies } from './components/companies/companies';
import { CompanyDetails } from './components/company-details/company-details';
import { EmployeeAssetManagement } from './components/employee-asset-management/employee-asset-management';

export const routes: Routes = [
  { path: '', redirectTo: '/empresas', pathMatch: 'full' },
  { path: 'empresas', component: Companies },
  { path: 'empresas/:id', component: CompanyDetails },
  { path: 'funcionario/:employeeId', component: EmployeeAssetManagement },
  { path: '**', redirectTo: '/empresas' }
];
