import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Companies } from './companies';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

describe('Companies', () => {
  let component: Companies;
  let fixture: ComponentFixture<Companies>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'Forte Tecnologias',
      cnpj: '12345678000195',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Tech Corp',
      cnpj: '98765432000123',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];

  beforeEach(async () => {
    const companyServiceSpy = jasmine.createSpyObj('CompanyService', ['getAllCompanies']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [Companies, NoopAnimationsModule],
      providers: [
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Companies);
    component = fixture.componentInstance;
    mockCompanyService = TestBed.inject(CompanyService) as jasmine.SpyObj<CompanyService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadCompanies on init', () => {
      spyOn(component, 'loadCompanies');
      component.ngOnInit();
      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('loadCompanies', () => {
    it('should load companies successfully', () => {
      mockCompanyService.getAllCompanies.and.returnValue(of(mockCompanies));

      component.loadCompanies();

      expect(component.loading).toBeFalse();
      expect(component.companies).toEqual(mockCompanies);
      expect(mockCompanyService.getAllCompanies).toHaveBeenCalled();
    });
  });

  describe('viewCompanyDetails', () => {
    it('should navigate to company details', () => {
      const company = mockCompanies[0];

      component.viewCompanyDetails(company);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/empresas', company.id]);
    });
  });

  describe('component properties', () => {
    it('should have correct displayed columns', () => {
      expect(component.displayedColumns).toEqual(['name', 'cnpj', 'createdAt', 'actions']);
    });

    it('should initialize with empty companies array', () => {
      expect(component.companies).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(component.loading).toBeFalse();
    });
  });
});