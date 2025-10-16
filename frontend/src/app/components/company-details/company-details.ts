import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Header } from '../header/header';
import { EmployeeForm, EmployeeFormData } from './employee-form/employee-form';
import { EmployeeDeleteConfirm, EmployeeDeleteData } from './employee-delete-confirm/employee-delete-confirm';
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
    MatDialogModule,
    Header
  ],
  templateUrl: './company-details.html',
  styleUrl: './company-details.scss'
})
export class CompanyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private companyService = inject(CompanyService);
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  company: Company | null = null;
  employees: Employee[] = [];
  loading = false;
  companyLoading = false;

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
    if (!this.company) return;

    const dialogRef = this.dialog.open(EmployeeForm, {
      width: '600px',
      data: { 
        mode: 'create', 
        companyId: this.company.id 
      } as EmployeeFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(this.company!.id);
      }
    });
  }

  openEditEmployeeDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeForm, {
      width: '600px',
      data: { 
        mode: 'edit', 
        employee,
        companyId: this.company!.id 
      } as EmployeeFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(this.company!.id);
      }
    });
  }

  openDeleteEmployeeDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDeleteConfirm, {
      width: '500px',
      data: { employee } as EmployeeDeleteData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(this.company!.id);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/companies']);
  }

  manageEmployeeAssets(employee: Employee): void {
    this.router.navigate(['/funcionario', employee.id]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
