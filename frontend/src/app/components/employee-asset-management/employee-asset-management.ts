import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { EmployeeService } from '../../services/employee.service';
import { Asset } from '../../models/asset.model';
import { Employee } from '../../models/employee.model';
import { Header } from '../header/header';
import { ApiError } from '../../utils/error-handler';

@Component({
  selector: 'app-employee-asset-management',
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
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    Header
  ],
  templateUrl: './employee-asset-management.html',
  styleUrl: './employee-asset-management.scss'
})
export class EmployeeAssetManagement implements OnInit {
  employee: Employee | null = null;
  employeeAssets: Asset[] = [];
  availableAssets: Asset[] = [];
  loading = false;
  employeeLoading = false;
  assetsLoading = false;
  availableAssetsLoading = false;
  selectedAssetId: string = '';

  constructor(
    private assetService: AssetService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('employeeId');
    if (employeeId) {
      this.loadEmployee(employeeId);
      this.loadEmployeeAssets(employeeId);
      this.loadAvailableAssets();
    }
  }

  loadEmployee(employeeId: string): void {
    this.employeeLoading = true;
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.employeeLoading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao carregar funcionário:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.employeeLoading = false;
      }
    });
  }

  loadEmployeeAssets(employeeId: string): void {
    this.assetsLoading = true;
    this.assetService.getAssetsByEmployee(employeeId).subscribe({
      next: (assets) => {
        this.employeeAssets = assets;
        this.assetsLoading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao carregar ativos do funcionário:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.assetsLoading = false;
      }
    });
  }

  loadAvailableAssets(): void {
    this.availableAssetsLoading = true;
    this.assetService.getAvailableAssets().subscribe({
      next: (assets) => {
        this.availableAssets = assets;
        this.availableAssetsLoading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao carregar ativos disponíveis:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.availableAssetsLoading = false;
      }
    });
  }

  associateAsset(): void {
    if (!this.selectedAssetId || !this.employee) {
      return;
    }

    this.loading = true;
    this.assetService.associateAsset(this.selectedAssetId, this.employee.id).subscribe({
      next: () => {
        this.snackBar.open('Ativo associado com sucesso', 'Fechar', {
          duration: 3000
        });
        this.loadEmployeeAssets(this.employee!.id);
        this.loadAvailableAssets();
        this.selectedAssetId = '';
        this.loading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao associar ativo:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  disassociateAsset(asset: Asset): void {
    this.loading = true;
    this.assetService.disassociateAsset(asset.id).subscribe({
      next: () => {
        this.snackBar.open('Ativo desassociado com sucesso', 'Fechar', {
          duration: 3000
        });
        this.loadEmployeeAssets(this.employee!.id);
        this.loadAvailableAssets();
        this.loading = false;
      },
      error: (error: ApiError) => {
        console.error('Erro ao desassociar ativo:', error);
        this.snackBar.open(error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.employee) {
      this.router.navigate(['/empresas', this.employee.companyId]);
    } else {
      this.router.navigate(['/empresas']);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Disponível':
        return 'available';
      case 'Em Uso':
        return 'in-use';
      case 'Em Manutenção':
        return 'maintenance';
      default:
        return 'default';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Notebook':
        return 'laptop';
      case 'Monitor':
        return 'monitor';
      case 'Celular':
        return 'phone_android';
      default:
        return 'inventory';
    }
  }

  openCreateAssetDialog(): void {
    console.log('Criar ativo');
  }

  openEditAssetDialog(asset: Asset): void {
    console.log('Editar ativo');
  }

  openDeleteAssetDialog(asset: Asset): void {
    console.log('Excluir ativo');
  }
}
