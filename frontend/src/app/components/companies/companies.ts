import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { CompanyForm } from '../company-form/company-form';

@Component({
  selector: 'app-companies',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss'
})
export class Companies implements OnInit {
  companies: Company[] = [];
  loading = false;
  displayedColumns: string[] = ['name', 'cnpj', 'createdAt', 'actions'];

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
        this.snackBar.open('Erro ao carregar empresas', 'Fechar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CompanyForm, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  openEditDialog(company: Company): void {
    const dialogRef = this.dialog.open(CompanyForm, {
      width: '500px',
      data: { mode: 'edit', company }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  deleteCompany(company: Company): void {
    if (confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) {
      this.companyService.deleteCompany(company.id).subscribe({
        next: () => {
          this.snackBar.open('Empresa excluída com sucesso', 'Fechar', {
            duration: 3000
          });
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Erro ao excluir empresa:', error);
          this.snackBar.open('Erro ao excluir empresa', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }
}
