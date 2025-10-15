import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyRepository } from '../repositories/company.repository';
import {
  CompanyNotFoundException,
  CompanyAlreadyExistsException,
} from '../../common/exceptions/business.exception';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: jest.Mocked<CompanyRepository>;

  const mockCompany = {
    id: 'company-1',
    name: 'Forte Tecnologias',
    cnpj: '12345678000195',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockCompanyRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      findByName: jest.fn(),
      findByCnpj: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepository = module.get(CompanyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new company successfully', async () => {
      const createCompanyDto = {
        name: 'Forte Tecnologias',
        cnpj: '12345678000195',
      };

      companyRepository.findByName.mockResolvedValue(null);
      companyRepository.findByCnpj.mockResolvedValue(null);
      companyRepository.create.mockResolvedValue(mockCompany);

      const result = await service.create(createCompanyDto);

      expect(companyRepository.findByName).toHaveBeenCalledWith('Forte Tecnologias');
      expect(companyRepository.findByCnpj).toHaveBeenCalledWith('12345678000195');
      expect(companyRepository.create).toHaveBeenCalledWith(createCompanyDto);
      expect(result).toEqual({
        id: 'company-1',
        name: 'Forte Tecnologias',
        cnpj: '12345678000195',
        createdAt: mockCompany.createdAt,
        updatedAt: mockCompany.updatedAt,
      });
    });

    it('should throw CompanyAlreadyExistsException when company name already exists', async () => {
      const createCompanyDto = {
        name: 'Forte Tecnologias',
        cnpj: '12345678000195',
      };

      companyRepository.findByName.mockResolvedValue(mockCompany);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        CompanyAlreadyExistsException,
      );
      expect(companyRepository.findByName).toHaveBeenCalledWith('Forte Tecnologias');
      expect(companyRepository.findByCnpj).not.toHaveBeenCalled();
      expect(companyRepository.create).not.toHaveBeenCalled();
    });

    it('should throw CompanyAlreadyExistsException when company CNPJ already exists', async () => {
      const createCompanyDto = {
        name: 'Forte Tecnologias',
        cnpj: '12345678000195',
      };

      companyRepository.findByName.mockResolvedValue(null);
      companyRepository.findByCnpj.mockResolvedValue(mockCompany);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        CompanyAlreadyExistsException,
      );
      expect(companyRepository.findByName).toHaveBeenCalledWith('Forte Tecnologias');
      expect(companyRepository.findByCnpj).toHaveBeenCalledWith('12345678000195');
      expect(companyRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all companies', async () => {
      const companies = [mockCompany];
      companyRepository.getAll.mockResolvedValue(companies);

      const result = await service.getAll();

      expect(companyRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(companies);
      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('should return company when found', async () => {
      companyRepository.getById.mockResolvedValue(mockCompany);

      const result = await service.getById('company-1');

      expect(companyRepository.getById).toHaveBeenCalledWith('company-1');
      expect(result).toEqual(mockCompany);
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      companyRepository.getById.mockResolvedValue(null);

      await expect(service.getById('non-existent')).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('update', () => {
    it('should update company successfully', async () => {
      const companyId = 'company-1';
      const updateCompanyDto = {
        name: 'Forte Tecnologias Atualizada',
        cnpj: '12345678000195',
      };
      const updatedCompany = { ...mockCompany, name: 'Forte Tecnologias Atualizada' };

      companyRepository.getById.mockResolvedValue(mockCompany);
      companyRepository.findByName.mockResolvedValue(null);
      companyRepository.update.mockResolvedValue(updatedCompany);

      const result = await service.update(companyId, updateCompanyDto);

      expect(companyRepository.getById).toHaveBeenCalledWith(companyId);
      expect(companyRepository.findByName).toHaveBeenCalledWith('Forte Tecnologias Atualizada');
      expect(companyRepository.update).toHaveBeenCalledWith(companyId, {
        ...updateCompanyDto,
        updatedAt: expect.any(Date),
      });
      expect(result.name).toBe('Forte Tecnologias Atualizada');
    });

    it('should throw CompanyNotFoundException when company not found', async () => {
      const updateCompanyDto = { name: 'Updated Name' };
      companyRepository.getById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateCompanyDto)).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should throw CompanyAlreadyExistsException when name already exists', async () => {
      const companyId = 'company-1';
      const updateCompanyDto = { name: 'Existing Company' };
      const existingCompany = { ...mockCompany, id: 'other-company' };

      companyRepository.getById.mockResolvedValue(mockCompany);
      companyRepository.findByName.mockResolvedValue(existingCompany);

      await expect(service.update(companyId, updateCompanyDto)).rejects.toThrow(
        CompanyAlreadyExistsException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith(companyId);
      expect(companyRepository.findByName).toHaveBeenCalledWith('Existing Company');
      expect(companyRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating with same name for same company', async () => {
      const companyId = 'company-1';
      const updateCompanyDto = { name: 'Forte Tecnologias' };

      companyRepository.getById.mockResolvedValue(mockCompany);
      companyRepository.update.mockResolvedValue(mockCompany);

      const result = await service.update(companyId, updateCompanyDto);

      expect(companyRepository.getById).toHaveBeenCalledWith(companyId);
      expect(companyRepository.update).toHaveBeenCalled();
      expect(result).toEqual(mockCompany);
    });
  });

  describe('remove', () => {
    it('should delete company successfully', async () => {
      const companyId = 'company-1';
      companyRepository.getById.mockResolvedValue(mockCompany);
      companyRepository.delete.mockResolvedValue(undefined);

      await service.remove(companyId);

      expect(companyRepository.getById).toHaveBeenCalledWith(companyId);
      expect(companyRepository.delete).toHaveBeenCalledWith(companyId);
    });

    it('should throw CompanyNotFoundException when company not found', async () => {    
      companyRepository.getById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        CompanyNotFoundException,
      );
      expect(companyRepository.getById).toHaveBeenCalledWith('non-existent');
      expect(companyRepository.delete).not.toHaveBeenCalled();
    });
  });
});
