import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { EmployeeAssetManagement } from './employee-asset-management';
import { AssetService } from '../../services/asset.service';
import { EmployeeService } from '../../services/employee.service';
import { Asset } from '../../models/asset.model';
import { Employee } from '../../models/employee.model';

describe('EmployeeAssetManagement', () => {
  let component: EmployeeAssetManagement;
  let fixture: ComponentFixture<EmployeeAssetManagement>;
  let mockAssetService: jasmine.SpyObj<AssetService>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockActivatedRoute: any;

  const mockEmployee: Employee = {
    id: '1',
    name: 'João Silva',
    email: 'joao@forte.com',
    cpf: '12345678901',
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockEmployeeAssets: Asset[] = [
    {
      id: '1',
      name: 'Notebook Dell',
      type: 'Notebook',
      status: 'Em Uso',
      employeeId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const mockAvailableAssets: Asset[] = [
    {
      id: '2',
      name: 'Monitor Samsung',
      type: 'Monitor',
      status: 'Disponível',
      employeeId: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Celular iPhone',
      type: 'Celular',
      status: 'Em Manutenção',
      employeeId: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  beforeEach(async () => {
    const assetServiceSpy = jasmine.createSpyObj('AssetService', [
      'getAssetsByEmployee', 
      'getAvailableAssets', 
      'associateAsset', 
      'disassociateAsset'
    ]);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployeeById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EmployeeAssetManagement, NoopAnimationsModule],
      providers: [
        { provide: AssetService, useValue: assetServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeAssetManagement);
    component = fixture.componentInstance;
    mockAssetService = TestBed.inject(AssetService) as jasmine.SpyObj<AssetService>;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load employee, assets and available assets on init', () => {
      spyOn(component, 'loadEmployee');
      spyOn(component, 'loadEmployeeAssets');
      spyOn(component, 'loadAvailableAssets');

      component.ngOnInit();

      expect(component.loadEmployee).toHaveBeenCalledWith('1');
      expect(component.loadEmployeeAssets).toHaveBeenCalledWith('1');
      expect(component.loadAvailableAssets).toHaveBeenCalled();
    });

    it('should not load data if no employeeId', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      spyOn(component, 'loadEmployee');
      spyOn(component, 'loadEmployeeAssets');
      spyOn(component, 'loadAvailableAssets');

      component.ngOnInit();

      expect(component.loadEmployee).not.toHaveBeenCalled();
      expect(component.loadEmployeeAssets).not.toHaveBeenCalled();
      expect(component.loadAvailableAssets).not.toHaveBeenCalled();
    });
  });

  describe('loadEmployee', () => {
    it('should load employee successfully', () => {
      mockEmployeeService.getEmployeeById.and.returnValue(of(mockEmployee));

      component.loadEmployee('1');

      expect(component.employee).toEqual(mockEmployee);
      expect(component.employeeLoading).toBeFalse();
      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith('1');
    });
  });

  describe('loadEmployeeAssets', () => {
    it('should load employee assets successfully', () => {
      mockAssetService.getAssetsByEmployee.and.returnValue(of(mockEmployeeAssets));

      component.loadEmployeeAssets('1');

      expect(component.employeeAssets).toEqual(mockEmployeeAssets);
      expect(component.assetsLoading).toBeFalse();
      expect(mockAssetService.getAssetsByEmployee).toHaveBeenCalledWith('1');
    });
  });

  describe('loadAvailableAssets', () => {
    it('should load available assets and filter out "Em Uso"', () => {
      const allAssets = [...mockAvailableAssets, {
        id: '4',
        name: 'Notebook HP',
        type: 'Notebook',
        status: 'Em Uso',
        employeeId: '2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }];
      mockAssetService.getAvailableAssets.and.returnValue(of(allAssets));

      component.loadAvailableAssets();

      expect(component.availableAssets).toEqual(mockAvailableAssets);
      expect(component.availableAssetsLoading).toBeFalse();
      expect(mockAssetService.getAvailableAssets).toHaveBeenCalled();
    });
  });

  describe('associateAsset', () => {
    beforeEach(() => {
      component.employee = mockEmployee;
      component.availableAssets = mockAvailableAssets;
    });

    it('should associate asset successfully', () => {
      component.selectedAssetId = '2';
      mockAssetService.associateAsset.and.returnValue(of({} as Asset));
      spyOn(component, 'loadEmployeeAssets');
      spyOn(component, 'loadAvailableAssets');

      component.associateAsset();

      expect(mockAssetService.associateAsset).toHaveBeenCalledWith('2', '1');
      expect(component.loadEmployeeAssets).toHaveBeenCalledWith('1');
      expect(component.loadAvailableAssets).toHaveBeenCalled();
      expect(component.selectedAssetId).toBe('');
      expect(component.loading).toBeFalse();
    });

    it('should not associate if no selected asset', () => {
      component.selectedAssetId = '';

      component.associateAsset();

      expect(mockAssetService.associateAsset).not.toHaveBeenCalled();
    });

    it('should not associate if no employee', () => {
      component.employee = null;
      component.selectedAssetId = '2';

      component.associateAsset();

      expect(mockAssetService.associateAsset).not.toHaveBeenCalled();
    });

    it('should not associate asset in maintenance', () => {
      component.selectedAssetId = '3'; // Asset in maintenance

      component.associateAsset();

      expect(mockAssetService.associateAsset).not.toHaveBeenCalled();
    });
  });

  describe('disassociateAsset', () => {
    beforeEach(() => {
      component.employee = mockEmployee;
    });

    it('should disassociate asset successfully', () => {
      const asset = mockEmployeeAssets[0];
      mockAssetService.disassociateAsset.and.returnValue(of({} as Asset));
      spyOn(component, 'loadEmployeeAssets');
      spyOn(component, 'loadAvailableAssets');

      component.disassociateAsset(asset);

      expect(mockAssetService.disassociateAsset).toHaveBeenCalledWith('1');
      expect(component.loadEmployeeAssets).toHaveBeenCalledWith('1');
      expect(component.loadAvailableAssets).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });

  describe('goBack', () => {
    it('should navigate to company details if employee exists', () => {
      component.employee = mockEmployee;

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/empresas', '1']);
    });

    it('should navigate to companies if no employee', () => {
      component.employee = null;

      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/empresas']);
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color for each status', () => {
      expect(component.getStatusColor('Disponível')).toBe('available');
      expect(component.getStatusColor('Em Uso')).toBe('in-use');
      expect(component.getStatusColor('Em Manutenção')).toBe('maintenance');
      expect(component.getStatusColor('Unknown')).toBe('default');
    });
  });

  describe('getTypeIcon', () => {
    it('should return correct icon for each type', () => {
      expect(component.getTypeIcon('Notebook')).toBe('laptop');
      expect(component.getTypeIcon('Monitor')).toBe('monitor');
      expect(component.getTypeIcon('Celular')).toBe('phone_android');
      expect(component.getTypeIcon('Unknown')).toBe('inventory');
    });
  });

  describe('component properties', () => {
    it('should initialize with null employee', () => {
      expect(component.employee).toBeNull();
    });

    it('should initialize with empty arrays', () => {
      expect(component.employeeAssets).toEqual([]);
      expect(component.availableAssets).toEqual([]);
    });

    it('should initialize with loading states false', () => {
      expect(component.loading).toBeFalse();
      expect(component.employeeLoading).toBeFalse();
      expect(component.assetsLoading).toBeFalse();
      expect(component.availableAssetsLoading).toBeFalse();
    });

    it('should initialize with empty selectedAssetId', () => {
      expect(component.selectedAssetId).toBe('');
    });
  });
});