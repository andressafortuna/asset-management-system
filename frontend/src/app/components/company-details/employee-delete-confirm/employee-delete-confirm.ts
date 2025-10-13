import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { ApiError } from '../../../utils/error-handler';

export interface EmployeeDeleteData {
  employee: Employee;
}

@Component({
  selector: 'app-employee-delete-confirm',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-delete-confirm.html',
  styleUrl: './employee-delete-confirm.scss'
})
export class EmployeeDeleteConfirm {
  loading = false;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EmployeeDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDeleteData
  ) { }

  onConfirm(): void {
    this.loading = true;
    this.employeeService.delete(this.data.employee.id).subscribe({
      next: () => {
        this.snackBar.open('Funcionário excluído com sucesso', 'Fechar', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error: ApiError) => {
        console.error('Erro ao excluir funcionário:', error);
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
