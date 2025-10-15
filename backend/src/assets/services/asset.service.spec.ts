import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetRepository } from '../repositories/asset.repository';
import { EmployeeRepository } from '../../employees/repositories/employee.repository';
import {
  AssetNotFoundException,
  AssetAlreadyExistsException,
  EmployeeNotFoundException,
  AssetNotAvailableException,
  EmployeeAlreadyHasNotebookException,
  AssetAssociatedWithEmployeeException,
} from '../../common/exceptions/business.exception';
import { AssetStatus } from '../dto/create-asset.dto';

describe('AssetService', () => {
  let service: AssetService;
  let assetRepository: jest.Mocked<AssetRepository>;
  let employeeRepository: jest.Mocked<EmployeeRepository>;

  const mockAsset = {
    id: 'asset-1',
    name: 'Notebook Dell',
    type: 'Notebook',
    status: AssetStatus.DISPONIVEL,
    employeeId: null,
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
    const mockAssetRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByName: jest.fn(),
      getByStatus: jest.fn(),
      getByType: jest.fn(),
      getByEmployeeId: jest.fn(),
      getAvailableAssets: jest.fn(),
      getEmployeeNotebookCount: jest.fn(),
      getByIdWithEmployee: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockEmployeeRepository = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: AssetRepository,
          useValue: mockAssetRepository,
        },
        {
          provide: EmployeeRepository,
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    assetRepository = module.get(AssetRepository);
    employeeRepository = module.get(EmployeeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new asset successfully', async () => {
      const createAssetDto = {
        name: 'Notebook Dell',
        type: 'Notebook',
        status: AssetStatus.DISPONIVEL,
      };

      assetRepository.getByName.mockResolvedValue(null);
      assetRepository.create.mockResolvedValue(mockAsset);

      
      const result = await service.create(createAssetDto);

      
      expect(assetRepository.getByName).toHaveBeenCalledWith('Notebook Dell');
      expect(assetRepository.create).toHaveBeenCalledWith(createAssetDto);
      expect(result).toEqual({
        id: 'asset-1',
        name: 'Notebook Dell',
        type: 'Notebook',
        status: AssetStatus.DISPONIVEL,
        employeeId: null,
        createdAt: mockAsset.createdAt,
        updatedAt: mockAsset.updatedAt,
      });
    });

    it('should throw AssetAlreadyExistsException when asset name already exists', async () => {
      
      const createAssetDto = {
        name: 'Notebook Dell',
        type: 'Notebook',
        status: AssetStatus.DISPONIVEL,
      };

      assetRepository.getByName.mockResolvedValue(mockAsset);

      
      await expect(service.create(createAssetDto)).rejects.toThrow(
        AssetAlreadyExistsException,
      );
      expect(assetRepository.getByName).toHaveBeenCalledWith('Notebook Dell');
      expect(assetRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return asset when found', async () => {
      assetRepository.getById.mockResolvedValue(mockAsset);

      const result = await service.getById('asset-1');

      expect(assetRepository.getById).toHaveBeenCalledWith('asset-1');
      expect(result).toEqual({
        id: 'asset-1',
        name: 'Notebook Dell',
        type: 'Notebook',
        status: AssetStatus.DISPONIVEL,
        employeeId: null,
        createdAt: mockAsset.createdAt,
        updatedAt: mockAsset.updatedAt,
      });
    });

    it('should throw AssetNotFoundException when asset not found', async () => {
      assetRepository.getById.mockResolvedValue(null);

      await expect(service.getById('non-existent')).rejects.toThrow(
        AssetNotFoundException,
      );
      expect(assetRepository.getById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('associateAsset', () => {
    it('should associate asset with employee successfully', async () => {
      const assetId = 'asset-1';
      const employeeId = 'employee-1';
      const updatedAsset = { ...mockAsset, status: AssetStatus.EM_USO, employeeId };

      assetRepository.getById.mockResolvedValue(mockAsset);
      employeeRepository.getById.mockResolvedValue(mockEmployee);
      assetRepository.getEmployeeNotebookCount.mockResolvedValue(0);
      assetRepository.update.mockResolvedValue(updatedAsset);

      const result = await service.associateAsset(assetId, employeeId);

      expect(assetRepository.getById).toHaveBeenCalledWith(assetId);
      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(assetRepository.getEmployeeNotebookCount).toHaveBeenCalledWith(employeeId);
      expect(assetRepository.update).toHaveBeenCalledWith(assetId, {
        status: AssetStatus.EM_USO,
        employee: { connect: { id: employeeId } },
        updatedAt: expect.any(Date),
      });
      expect(result.employeeId).toBe(employeeId);
      expect(result.status).toBe(AssetStatus.EM_USO);
    });

    it('should throw AssetNotFoundException when asset not found', async () => {
      assetRepository.getById.mockResolvedValue(null);

      await expect(service.associateAsset('non-existent', 'employee-1')).rejects.toThrow(
        AssetNotFoundException,
      );
    });

    it('should throw EmployeeNotFoundException when employee not found', async () => {
      assetRepository.getById.mockResolvedValue(mockAsset);
      employeeRepository.getById.mockResolvedValue(null);

      await expect(service.associateAsset('asset-1', 'non-existent')).rejects.toThrow(
        EmployeeNotFoundException,
      );
    });

    it('should throw AssetNotAvailableException when asset is not available', async () => {
      const unavailableAsset = { ...mockAsset, status: AssetStatus.EM_USO };
      assetRepository.getById.mockResolvedValue(unavailableAsset);
      employeeRepository.getById.mockResolvedValue(mockEmployee);

      await expect(service.associateAsset('asset-1', 'employee-1')).rejects.toThrow(
        AssetNotAvailableException,
      );
    });

    it('should throw EmployeeAlreadyHasNotebookException when employee already has a notebook', async () => {
      const notebookAsset = { ...mockAsset, type: 'Notebook' };
      assetRepository.getById.mockResolvedValue(notebookAsset);
      employeeRepository.getById.mockResolvedValue(mockEmployee);
      assetRepository.getEmployeeNotebookCount.mockResolvedValue(1);

      await expect(service.associateAsset('asset-1', 'employee-1')).rejects.toThrow(
        EmployeeAlreadyHasNotebookException,
      );
    });

    it('should allow associating non-notebook assets even if employee has a notebook', async () => {
      const monitorAsset = { ...mockAsset, type: 'Monitor' };
      const updatedAsset = { ...monitorAsset, status: AssetStatus.EM_USO, employeeId: 'employee-1' };
      
      assetRepository.getById.mockResolvedValue(monitorAsset);
      employeeRepository.getById.mockResolvedValue(mockEmployee);
      assetRepository.getEmployeeNotebookCount.mockResolvedValue(1);
      assetRepository.update.mockResolvedValue(updatedAsset);

      const result = await service.associateAsset('asset-1', 'employee-1');

      expect(result.employeeId).toBe('employee-1');
      expect(result.status).toBe(AssetStatus.EM_USO);
      expect(assetRepository.update).toHaveBeenCalled();
    });
  });

  describe('disassociateAsset', () => {
    it('should disassociate asset successfully', async () => {
      const assetId = 'asset-1';
      const associatedAsset = { ...mockAsset, status: AssetStatus.EM_USO, employeeId: 'employee-1' };
      const updatedAsset = { ...associatedAsset, status: AssetStatus.DISPONIVEL, employeeId: null };

      assetRepository.getById.mockResolvedValue(associatedAsset);
      assetRepository.update.mockResolvedValue(updatedAsset);

      const result = await service.disassociateAsset(assetId);

      expect(assetRepository.getById).toHaveBeenCalledWith(assetId);
      expect(assetRepository.update).toHaveBeenCalledWith(assetId, {
        status: AssetStatus.DISPONIVEL,
        employee: { disconnect: true },
        updatedAt: expect.any(Date),
      });
      expect(result.status).toBe(AssetStatus.DISPONIVEL);
      expect(result.employeeId).toBeNull();
    });

    it('should throw AssetNotFoundException when asset not found', async () => {
      assetRepository.getById.mockResolvedValue(null);

      await expect(service.disassociateAsset('non-existent')).rejects.toThrow(
        AssetNotFoundException,
      );
    });

    it('should throw AssetNotAvailableException when asset is not in use', async () => {
      assetRepository.getById.mockResolvedValue(mockAsset);

      await expect(service.disassociateAsset('asset-1')).rejects.toThrow(
        AssetNotAvailableException,
      );
    });
  });

  describe('remove', () => {
    it('should delete asset successfully when not associated', async () => {
      const assetId = 'asset-1';
      assetRepository.getByIdWithEmployee.mockResolvedValue(mockAsset);
      assetRepository.delete.mockResolvedValue(undefined);

      await service.remove(assetId);

      expect(assetRepository.getByIdWithEmployee).toHaveBeenCalledWith(assetId);
      expect(assetRepository.delete).toHaveBeenCalledWith(assetId);
    });

    it('should throw AssetNotFoundException when asset not found', async () => {
      assetRepository.getByIdWithEmployee.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        AssetNotFoundException,
      );
      expect(assetRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw AssetAssociatedWithEmployeeException when asset is associated', async () => {
      const associatedAsset = {
        ...mockAsset,
        employeeId: 'employee-1',
        employee: { name: 'João Silva' },
      };
      assetRepository.getByIdWithEmployee.mockResolvedValue(associatedAsset);

      await expect(service.remove('asset-1')).rejects.toThrow(
        AssetAssociatedWithEmployeeException,
      );
      expect(assetRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getByEmployeeId', () => {
    it('should return assets for employee', async () => {
      const employeeId = 'employee-1';
      const employeeAssets = [mockAsset];
      
      employeeRepository.getById.mockResolvedValue(mockEmployee);
      assetRepository.getByEmployeeId.mockResolvedValue(employeeAssets);

      const result = await service.getByEmployeeId(employeeId);

      expect(employeeRepository.getById).toHaveBeenCalledWith(employeeId);
      expect(assetRepository.getByEmployeeId).toHaveBeenCalledWith(employeeId);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('asset-1');
    });

    it('should throw EmployeeNotFoundException when employee not found', async () => {
      employeeRepository.getById.mockResolvedValue(null);

      await expect(service.getByEmployeeId('non-existent')).rejects.toThrow(
        EmployeeNotFoundException,
      );
      expect(assetRepository.getByEmployeeId).not.toHaveBeenCalled();
    });
  });
});
