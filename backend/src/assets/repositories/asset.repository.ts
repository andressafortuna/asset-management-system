import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Asset, Prisma } from '@prisma/client';

@Injectable()
export class AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return this.prisma.asset.create({
      data,
    });
  }

  async getAll(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }

  async getByIdWithEmployee(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async getByName(name: string): Promise<Asset | null> {
    return this.prisma.asset.findFirst({
      where: { name },
    });
  }

  async getByStatus(status: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByType(type: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { type },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByEmployeeId(employeeId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { employeeId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAvailableAssets(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { 
        status: 'Disponível',
        employeeId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: Prisma.AssetUpdateInput): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Asset> {
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.asset.count();
  }

  async getEmployeeNotebookCount(employeeId: string): Promise<number> {
    return this.prisma.asset.count({
      where: {
        employeeId,
        type: 'Notebook',
        status: 'Em Uso',
      },
    });
  }
}
