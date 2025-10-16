import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AssetService } from '../../../services/asset.service';
import { Asset } from '../../../models/asset.model';
import { ApiError } from '../../../utils/error-handler';

export interface AssetFormData {
    mode: 'create' | 'edit';
    asset?: Asset;
}

@Component({
    selector: 'app-asset-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './asset-form.html',
    styleUrl: './asset-form.scss'
})
export class AssetForm {
    private fb = inject(FormBuilder);
    private assetService = inject(AssetService);
    private snackBar = inject(MatSnackBar);
    private dialogRef = inject<MatDialogRef<AssetForm>>(MatDialogRef);
    data = inject<AssetFormData>(MAT_DIALOG_DATA);

    form: FormGroup;
    loading = false;
    types: string[] = ['Notebook', 'Monitor', 'Celular'];
    statuses: string[] = ['Disponível', 'Em Manutenção'];

    constructor(...args: unknown[]);

    constructor() {
        const data = this.data;

        const initialStatus = data.asset?.status === 'Em Uso' ? 'Em Uso' : (data.asset?.status || 'Disponível');

        this.form = this.fb.group({
            name: [data.asset?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            type: [data.asset?.type || '', [Validators.required]],
            status: [initialStatus, [Validators.required]]
        });
    }

    get isEdit(): boolean {
        return this.data.mode === 'edit';
    }

    get isAssetInUse(): boolean {
        return this.data.asset?.status === 'Em Uso';
    }

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading = true;

        if (this.isEdit && this.data.asset) {
            this.assetService.update(this.data.asset.id, this.form.value).subscribe({
                next: (asset) => {
                    this.snackBar.open('Ativo atualizado com sucesso', 'Fechar', { duration: 3000 });
                    this.dialogRef.close(asset);
                },
                error: (error: ApiError) => {
                    this.snackBar.open(error.message, 'Fechar', { duration: 5000 });
                    this.loading = false;
                }
            });
        } else {
            this.assetService.create(this.form.value).subscribe({
                next: (asset) => {
                    this.snackBar.open('Ativo criado com sucesso', 'Fechar', { duration: 3000 });
                    this.dialogRef.close(asset);
                },
                error: (error: ApiError) => {
                    this.snackBar.open(error.message, 'Fechar', { duration: 5000 });
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}


