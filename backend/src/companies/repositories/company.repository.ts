import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

  async getAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: { name },
    });
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { cnpj },
    });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.company.count();
  }
}
