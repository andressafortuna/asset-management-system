import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Header } from '../header/header';
import { CompanyService } from '../../services/company.service';
import { EmployeeService } from '../../services/employee.service';
import { Company } from '../../models/company.model';
import { Employee } from '../../models/employee.model';
import { ApiError } from '../../utils/error-handler';

@Component({
  selector: 'app-company-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    Header
  ],
  templateUrl: './company-details.html',
  styleUrl: './company-details.scss'
})
export class CompanyDetails implements OnInit {
  company: Company | null = null;
  employees: Employee[] = [];
  loading = false;
  companyLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCompanyDetails();
  }

  loadCompanyDetails(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (!companyId) {
      this.router.navigate(['/companies']);
      return;
    }

    this.companyLoading = true;
    this.companyService.getCompanyById(companyId).subscribe({
      next: (company) => {
        this.company = company;
        this.loadEmployees(companyId);
      },
      error: (error: ApiError) => {
        console.error('Erro ao carregar empresa:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.companyLoading = false;
        this.router.navigate(['/companies']);
      }
    });
  }

  loadEmployees(companyId: string): void {
    this.loading = true;
    this.employeeService.getEmployeesByCompany(companyId).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
        this.companyLoading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao carregar funcionários:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
        this.companyLoading = false;
      }
    });
  }

  openCreateEmployeeDialog(): void {
    console.log('Abrir modal de criação');
  }

  goBack(): void {
    this.router.navigate(['/companies']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
