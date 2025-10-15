import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CompanyRepository } from '../../companies/repositories/company.repository';
import {
  EmployeeNotFoundException,
  EmployeeAlreadyExistsException,
  CompanyNotFoundException,
} from '../../common/exceptions/business.exception';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let employeeRepository: jest.Mocked<EmployeeRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;

  const mockCompany = {
    id: 'company-1',
    name: 'Forte Tecnologias',
    cnpj: '12345678000195',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployee = {
    id: 'employee-1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    cpf: '12345678901',
    companyId: 'company-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockEmployeeRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByEmail: jest.fn(),
      getByCpf: jest.fn(),
      getByCompanyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockCompanyRepository = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: EmployeeRepository,
          useValue: mockEmployeeRepository,
        },
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    employeeRepository = module.get(EmployeeRepository);
    companyRepository = module.get(CompanyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new employee successfully', async () => {
      const createEmployeeDto = {
        name: 'João Silva',
        email: 'joao@empresa.com',
        cpf: '12345678901',
        companyId: 'company-1',
      };

      companyRepository.getById.mockResolvedValue(mockCompany);
      employeeRepository.getByEmail.mockResolvedValue(null);
      employeeRepository.getByCpf.mockResolvedValue(null);
      employeeRepository.create.mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);

      expect(companyRepository.getById).toHaveBeenCalledWith('company-1');
      expect(employeeRepository.getByEmail).toHaveBeenCalledWith('joao@empresa.com');
      expect(employeeRepository.getByCpf).toHaveBeenCalledWith('12345678901');
      expect(employeeRepository.create).toHaveBeenCalledWith({
        name: createEmployeeDto.name,
        email: createEmployeeDto.email,
        cpf: createEmployeeDto.cpf,
        company: {
          connect: { id: createEmployeeDto.companyId },
        },
      });
      expect(result).toEqual(mockEmployee);
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      const createEmployeeDto = {
        name: 'João Silva',
        email: 'joao@empresa.com',
        cpf: '12345678901',
        companyId: 'non-existent',
      };

      companyRepository.getById.mockResolvedValue(null);

      await expect(service.create(createEmployeeDto)).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(employeeRepository.create).not.toHaveBeenCalled();
    });

    it('should throw EmployeeAlreadyExistsException when email already exists', async () => {
      const createEmployeeDto = {
        name: 'João Silva',
        email: 'joao@empresa.com',
        cpf: '12345678901',
        companyId: 'company-1',
      };

      companyRepository.getById.mockResolvedValue(mockCompany);
      employeeRepository.getByEmail.mockResolvedValue(mockEmployee);

      await expect(service.create(createEmployeeDto)).rejects.toThrow(
        EmployeeAlreadyExistsException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('company-1');
      expect(employeeRepository.getByEmail).toHaveBeenCalledWith('joao@empresa.com');
      expect(employeeRepository.getByCpf).not.toHaveBeenCalled();
      expect(employeeRepository.create).not.toHaveBeenCalled();
    });

    it('should throw EmployeeAlreadyExistsException when CPF already exists', async () => {
      const createEmployeeDto = {
        name: 'João Silva',
        email: 'joao@empresa.com',
        cpf: '12345678901',
        companyId: 'company-1',
      };

      companyRepository.getById.mockResolvedValue(mockCompany);
      employeeRepository.getByEmail.mockResolvedValue(null);
      employeeRepository.getByCpf.mockResolvedValue(mockEmployee);

      await expect(service.create(createEmployeeDto)).rejects.toThrow(
        EmployeeAlreadyExistsException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('company-1');
      expect(employeeRepository.getByEmail).toHaveBeenCalledWith('joao@empresa.com');
      expect(employeeRepository.getByCpf).toHaveBeenCalledWith('12345678901');
      expect(employeeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all employees', async () => {
      const employees = [mockEmployee];
      employeeRepository.getAll.mockResolvedValue(employees);

      const result = await service.getAll();

      expect(employeeRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(employees);
      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('should return employee when found', async () => {
      employeeRepository.getById.mockResolvedValue(mockEmployee);

      const result = await service.getById('employee-1');

      expect(employeeRepository.getById).toHaveBeenCalledWith('employee-1');
      expect(result).toEqual(mockEmployee);
    });

    it('should throw EmployeeNotFoundException when employee not found', async () => {
      employeeRepository.getById.mockResolvedValue(null);

      await expect(service.getById('non-existent')).rejects.toThrow(
        EmployeeNotFoundException,
      );
      expect(employeeRepository.getById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getByCompanyId', () => {
    it('should return employees for company', async () => {
      const companyId = 'company-1';
      const employees = [mockEmployee];
      
      companyRepository.getById.mockResolvedValue(mockCompany);
      employeeRepository.getByCompanyId.mockResolvedValue(employees);

      const result = await service.getByCompanyId(companyId);

      expect(companyRepository.getById).toHaveBeenCalledWith(companyId);
      expect(employeeRepository.getByCompanyId).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(employees);
      expect(result).toHaveLength(1);
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      companyRepository.getById.mockResolvedValue(null);

      await expect(service.getByCompanyId('non-existent')).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(employeeRepository.getByCompanyId).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update employee successfully', async () => {
      const employeeId = 'employee-1';
      const updateEmployeeDto = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@empresa.com',
        cpf: '12345678901',
        companyId: 'company-1',
      };
      const updatedEmployee = { ...mockEmployee, name: 'João Silva Atualizado' };

      employeeRepository.getById.mockResolvedValue(mockEmployee);
      employeeRepository.getByEmail.mockResolvedValue(null);
      employeeRepository.getByCpf.mockResolvedValue(null);
      employeeRepository.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(employeeId, updateEmployeeDto);

      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(employeeRepository.getByEmail).toHaveBeenCalledWith('joao.novo@empresa.com');
      expect(employeeRepository.update).toHaveBeenCalledWith(employeeId, {
        ...updateEmployeeDto,
        updatedAt: expect.any(Date),
      });
      expect(result.name).toBe('João Silva Atualizado');
    });

    it('should throw EmployeeNotFoundException when employee not found', async () => {
      const updateEmployeeDto = { name: 'Updated Name' };
      employeeRepository.getById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateEmployeeDto)).rejects.toThrow(
        EmployeeNotFoundException,
      );
      expect(employeeRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(employeeRepository.update).not.toHaveBeenCalled();
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      const employeeId = 'employee-1';
      const updateEmployeeDto = { companyId: 'non-existent' };

      employeeRepository.getById.mockResolvedValue(mockEmployee);
      companyRepository.getById.mockResolvedValue(null);

      await expect(service.update(employeeId, updateEmployeeDto)).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(employeeRepository.update).not.toHaveBeenCalled();
    });

    it('should throw EmployeeAlreadyExistsException when email already exists', async () => {
      const employeeId = 'employee-1';
      const updateEmployeeDto = { email: 'existing@empresa.com' };
      const existingEmployee = { ...mockEmployee, id: 'other-employee' };

      employeeRepository.getById.mockResolvedValue(mockEmployee);
      companyRepository.getById.mockResolvedValue(mockCompany);
      employeeRepository.getByEmail.mockResolvedValue(existingEmployee);

      await expect(service.update(employeeId, updateEmployeeDto)).rejects.toThrow(
        EmployeeAlreadyExistsException,
      );
      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(employeeRepository.getByEmail).toHaveBeenCalledWith('existing@empresa.com');
      expect(employeeRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating with same email for same employee', async () => {
      const employeeId = 'employee-1';
      const updateEmployeeDto = { email: 'joao@empresa.com' }; 

      employeeRepository.getById.mockResolvedValue(mockEmployee);
      employeeRepository.update.mockResolvedValue(mockEmployee);

      const result = await service.update(employeeId, updateEmployeeDto);

      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(employeeRepository.update).toHaveBeenCalled();
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('remove', () => {
    it('should delete employee successfully', async () => {
      const employeeId = 'employee-1';
      employeeRepository.getById.mockResolvedValue(mockEmployee);
      employeeRepository.delete.mockResolvedValue(undefined);

      await service.remove(employeeId);

      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(employeeRepository.delete).toHaveBeenCalledWith(employeeId);
    });

    it('should throw EmployeeNotFoundException when employee not found', async () => {
      employeeRepository.getById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        EmployeeNotFoundException,
      );
      expect(employeeRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(employeeRepository.delete).not.toHaveBeenCalled();
    });
  });
});
