import { Injectable } from '@nestjs/common';
import { AssetRepository } from '../repositories/asset.repository';
import { EmployeeRepository } from '../../employees/repositories/employee.repository';
import { CreateAssetDto, AssetStatus } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { AssetResponseDto } from '../dto/asset-response.dto';
import {
  AssetNotFoundException,
  AssetAlreadyExistsException,
  EmployeeNotFoundException,
  AssetNotAvailableException,
  EmployeeAlreadyHasNotebookException,
  AssetAssociatedWithEmployeeException,
} from '../../common/exceptions/business.exception';
import { Asset, Employee } from '@prisma/client';

type AssetWithEmployee = Asset & {
  employee?: Employee | null;
};

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    const existingByName = await this.assetRepository.getByName(createAssetDto.name);
    if (existingByName) {
      throw new AssetAlreadyExistsException('name', createAssetDto.name);
    }

    const asset = await this.assetRepository.create({
      name: createAssetDto.name,
      type: createAssetDto.type,
      status: createAssetDto.status,
    });

    return this.mapToResponseDto(asset);
  }

  async getAll(): Promise<AssetResponseDto[]> {
    const assets = await this.assetRepository.getAll();
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async getById(id: string): Promise<AssetResponseDto> {
    const asset = await this.assetRepository.getById(id);
    if (!asset) {
      throw new AssetNotFoundException();
    }

    return this.mapToResponseDto(asset);
  }

  async getByStatus(status: string): Promise<AssetResponseDto[]> {
    const assets = await this.assetRepository.getByStatus(status);
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async getByType(type: string): Promise<AssetResponseDto[]> {
    const assets = await this.assetRepository.getByType(type);
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async getByEmployeeId(employeeId: string): Promise<AssetResponseDto[]> {
    const employee = await this.employeeRepository.getById(employeeId);
    if (!employee) {
      throw new EmployeeNotFoundException();
    }

    const assets = await this.assetRepository.getByEmployeeId(employeeId);
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async getAvailableAssets(): Promise<AssetResponseDto[]> {
    const assets = await this.assetRepository.getAvailableAssets();
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<AssetResponseDto> {
    const existingAsset = await this.assetRepository.getById(id);
    if (!existingAsset) {
      throw new AssetNotFoundException();
    }

    if (updateAssetDto.name && updateAssetDto.name !== existingAsset.name) {
      const existingByName = await this.assetRepository.getByName(updateAssetDto.name);
      if (existingByName) {
        throw new AssetAlreadyExistsException('name', updateAssetDto.name);
      }
    }

    const updateData = {
      ...updateAssetDto,
      updatedAt: new Date(),
    };

    const asset = await this.assetRepository.update(id, updateData);
    return this.mapToResponseDto(asset);
  }

  async remove(id: string): Promise<void> {
    const existingAsset = await this.assetRepository.getByIdWithEmployee(id);
    if (!existingAsset) {
      throw new AssetNotFoundException();
    }

    const assetWithEmployee = existingAsset as AssetWithEmployee;
    if (assetWithEmployee.employeeId && assetWithEmployee.employee) {
      throw new AssetAssociatedWithEmployeeException(assetWithEmployee.employee.name);
    }

    await this.assetRepository.delete(id);
  }

  async associateAsset(assetId: string, employeeId: string): Promise<AssetResponseDto> {
    const asset = await this.assetRepository.getById(assetId);
    if (!asset) {
      throw new AssetNotFoundException();
    }

    const employee = await this.employeeRepository.getById(employeeId);
    if (!employee) {
      throw new EmployeeNotFoundException();
    }

    if (asset.status !== AssetStatus.DISPONIVEL) {
      throw new AssetNotAvailableException();
    }

    if (asset.type === 'Notebook') {
      const notebookCount = await this.assetRepository.getEmployeeNotebookCount(employeeId);
      if (notebookCount > 0) {
        throw new EmployeeAlreadyHasNotebookException();
      }
    }

    const updatedAsset = await this.assetRepository.update(assetId, {
      status: AssetStatus.EM_USO,
      employee: {
        connect: { id: employeeId },
      },
      updatedAt: new Date(),
    });

    return this.mapToResponseDto(updatedAsset);
  }

  async disassociateAsset(assetId: string): Promise<AssetResponseDto> {
    const asset = await this.assetRepository.getById(assetId);
    if (!asset) {
      throw new AssetNotFoundException();
    }

    if (asset.status !== AssetStatus.EM_USO) {
      throw new AssetNotAvailableException();
    }

    const updatedAsset = await this.assetRepository.update(assetId, {
      status: AssetStatus.DISPONIVEL,
      employee: {
        disconnect: true,
      },
      updatedAt: new Date(),
    });

    return this.mapToResponseDto(updatedAsset);
  }

  private mapToResponseDto(asset: Asset): AssetResponseDto {
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      status: asset.status,
      employeeId: asset.employeeId,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }
}
