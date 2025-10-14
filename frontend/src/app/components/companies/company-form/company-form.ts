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
import { CompanyService } from '../../../services/company.service';
import { Company, CreateCompanyRequest } from '../../../models/company.model';
import { ApiError } from '../../../utils/error-handler';

export interface CompanyFormData {
  mode: 'create' | 'edit';
  company?: Company;
}

@Component({
  selector: 'app-company-form',
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
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss'
})
export class CompanyForm implements OnInit {
  companyForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CompanyForm>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyFormData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      cnpj: ['', [Validators.required, this.cnpjValidator]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.company) {
      this.companyForm.patchValue({
        name: this.data.company.name,
        cnpj: this.data.company.cnpj
      });
    }
  }

  cnpjValidator(control: any) {
    const cnpj = control.value;
    if (!cnpj) return null;

    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return cnpjRegex.test(cnpj) ? null : { invalidCnpj: true };
  }

  formatCnpj(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }

    this.companyForm.patchValue({ cnpj: value });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.loading = true;
      const formData: CreateCompanyRequest = this.companyForm.value;

      if (this.isEditMode && this.data.company) {
        this.companyService.updateCompany(this.data.company.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Empresa atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: ApiError) => {
            console.error('Erro ao atualizar empresa:', error);
            this.snackBar.open(error.message, 'Fechar', {
              duration: 5000
            });
            this.loading = false;
          }
        });
      } else {
        this.companyService.createCompany(formData).subscribe({
          next: () => {
            this.snackBar.open('Empresa criada com sucesso!', 'Fechar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: ApiError) => {
            console.error('Erro ao criar empresa:', error);
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
    Object.keys(this.companyForm.controls).forEach(key => {
      const control = this.companyForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.companyForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName === 'name' ? 'Nome' : 'CNPJ'} é obrigatório`;
    }
    if (control?.hasError('minlength')) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (control?.hasError('maxlength')) {
      return 'Nome deve ter no máximo 100 caracteres';
    }
    if (control?.hasError('invalidCnpj')) {
      return 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX';
    }
    return '';
  }
}
