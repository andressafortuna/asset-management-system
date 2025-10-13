import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../services/employee.service';
import { Employee, CreateEmployeeRequest } from '../../../models/employee.model';
import { ApiError } from '../../../utils/error-handler';

export interface EmployeeFormData {
  mode: 'create' | 'edit';
  employee?: Employee;
  companyId: string;
}

@Component({
  selector: 'app-employee-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss'
})
export class EmployeeForm implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EmployeeForm>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeFormData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.cpfValidator]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.employee) {
      this.employeeForm.patchValue({
        name: this.data.employee.name,
        email: this.data.employee.email,
        cpf: this.data.employee.cpf
      });
    }
  }

  cpfValidator(control: any) {
    const cpf = control.value;
    if (!cpf) return null;
    
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf) ? null : { invalidCpf: true };
  }

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    
    this.employeeForm.patchValue({ cpf: value });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const formData: CreateEmployeeRequest = {
        ...this.employeeForm.value,
        companyId: this.data.companyId
      };

      if (this.isEditMode && this.data.employee) {
        this.employeeService.update(this.data.employee.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Funcionário atualizado com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: ApiError) => {
            console.error('Erro ao atualizar funcionário:', error);
            this.snackBar.open(error.message, 'Fechar', {
              duration: 5000
            });
            this.loading = false;
          }
        });
      } else {
        this.employeeService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('Funcionário criado com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: ApiError) => {
            console.error('Erro ao criar funcionário:', error);
            this.snackBar.open(error.message, 'Fechar', {
              duration: 5000
            });
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (control?.hasError('required')) {
      const fieldLabels: { [key: string]: string } = {
        'name': 'Nome',
        'email': 'Email',
        'cpf': 'CPF'
      };
      return `${fieldLabels[fieldName]} é obrigatório`;
    }
    if (control?.hasError('minlength')) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (control?.hasError('maxlength')) {
      return 'Nome deve ter no máximo 100 caracteres';
    }
    if (control?.hasError('email')) {
      return 'Email deve ter um formato válido';
    }
    if (control?.hasError('invalidCpf')) {
      return 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }
    return '';
  }
}
