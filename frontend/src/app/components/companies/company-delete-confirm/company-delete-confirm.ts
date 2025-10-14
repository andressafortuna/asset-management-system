import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { ApiError } from '../../../utils/error-handler';

export interface CompanyDeleteData {
  company: Company;
}

@Component({
  selector: 'app-company-delete-confirm',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './company-delete-confirm.html',
  styleUrl: './company-delete-confirm.scss'
})
export class CompanyDeleteConfirm {
  loading = false;

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CompanyDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDeleteData
  ) { }

  onConfirm(): void {
    this.loading = true;
    this.companyService.deleteCompany(this.data.company.id).subscribe({
      next: () => {
        this.snackBar.open('Empresa excluída com sucesso', 'Fechar', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error: ApiError) => {
        console.error('Erro ao excluir empresa:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
