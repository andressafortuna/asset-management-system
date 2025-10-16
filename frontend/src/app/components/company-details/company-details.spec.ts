import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CompanyDetails } from './company-details';
import { CompanyService } from '../../services/company.service';
import { EmployeeService } from '../../services/employee.service';
import { Company } from '../../models/company.model';
import { Employee } from '../../models/employee.model';

describe('CompanyDetails', () => {
  let component: CompanyDetails;
  let fixture: ComponentFixture<CompanyDetails>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockActivatedRoute: any;

  const mockCompany: Company = {
    id: '1',
    name: 'Forte Tecnologias',
    cnpj: '12345678000195',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@forte.com',
      cpf: '12345678901',
      companyId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@forte.com',
      cpf: '98765432100',
      companyId: '1',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];

  beforeEach(async () => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['getCompanyById']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getEmployeesByCompany']);
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
      imports: [CompanyDetails, NoopAnimationsModule],
      providers: [
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetails);
    component = fixture.componentInstance;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadCompanyDetails on init', () => {
      spyOn(component, 'loadCompanyDetails');
      component.ngOnInit();
      expect(component.loadCompanyDetails).toHaveBeenCalled();
    });
  });

  describe('loadCompanyDetails', () => {
    it('should load company and employees successfully', () => {
      mockCompanyService.getCompanyById.and.returnValue(of(mockCompany));
      mockEmployeeService.getEmployeesByCompany.and.returnValue(of(mockEmployees));

      component.loadCompanyDetails();

      expect(component.company).toEqual(mockCompany);
      expect(component.employees).toEqual(mockEmployees);
      expect(component.loading).toBeFalse();
      expect(component.companyLoading).toBeFalse();
      expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith('1');
      expect(mockEmployeeService.getEmployeesByCompany).toHaveBeenCalledWith('1');
    });

    it('should navigate to companies if no company ID', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      component.loadCompanyDetails();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/companies']);
    });
  });

  describe('loadEmployees', () => {
    it('should load employees successfully', () => {
      mockEmployeeService.getEmployeesByCompany.and.returnValue(of(mockEmployees));

      component.loadEmployees('1');

      expect(component.employees).toEqual(mockEmployees);
      expect(component.loading).toBeFalse();
      expect(component.companyLoading).toBeFalse();
      expect(mockEmployeeService.getEmployeesByCompany).toHaveBeenCalledWith('1');
    });
  });

  describe('goBack', () => {
    it('should navigate to companies page', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/companies']);
    });
  });

  describe('manageEmployeeAssets', () => {
    it('should navigate to employee asset management', () => {
      const employee = mockEmployees[0];

      component.manageEmployeeAssets(employee);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/funcionario', employee.id]);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const formatted = component.formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('component properties', () => {
    it('should initialize with null company', () => {
      expect(component.company).toBeNull();
    });

    it('should initialize with empty employees array', () => {
      expect(component.employees).toEqual([]);
    });

    it('should initialize with loading states false', () => {
      expect(component.loading).toBeFalse();
      expect(component.companyLoading).toBeFalse();
    });
  });
});