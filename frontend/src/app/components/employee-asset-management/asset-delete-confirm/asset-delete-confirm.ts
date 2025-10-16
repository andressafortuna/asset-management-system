import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AssetService } from '../../../services/asset.service';
import { Asset } from '../../../models/asset.model';
import { ApiError } from '../../../utils/error-handler';

export interface AssetDeleteData {
  asset: Asset;
}

@Component({
  selector: 'app-asset-delete-confirm',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './asset-delete-confirm.html',
  styleUrl: './asset-delete-confirm.scss'
})
export class AssetDeleteConfirm {
  private assetService = inject(AssetService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject<MatDialogRef<AssetDeleteConfirm>>(MatDialogRef);
  data = inject<AssetDeleteData>(MAT_DIALOG_DATA);

  loading = false;

  onConfirm(): void {
    this.loading = true;
    this.assetService.delete(this.data.asset.id).subscribe({
      next: () => {
        this.snackBar.open('Ativo excluído com sucesso', 'Fechar', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error: ApiError) => {
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


