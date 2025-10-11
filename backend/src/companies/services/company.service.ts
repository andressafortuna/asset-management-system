import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repositories/company.repository';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompanyNotFoundException, CompanyAlreadyExistsException, } from '../../common/exceptions/business.exception';

@Injectable()
export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepository) { }

    async create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto> {

        const existingByName = await this.companyRepository.findByName(createCompanyDto.name);
        if (existingByName) {
            throw new CompanyAlreadyExistsException('name', createCompanyDto.name);
        }

        const existingByCnpj = await this.companyRepository.findByCnpj(createCompanyDto.cnpj);
        if (existingByCnpj) {
            throw new CompanyAlreadyExistsException('CNPJ', createCompanyDto.cnpj);
        }

        const company = await this.companyRepository.create({
            name: createCompanyDto.name,
            cnpj: createCompanyDto.cnpj,
        });

        return this.mapToResponseDto(company);
    }

    async getAll(): Promise<CompanyResponseDto[]> {
        const companies = await this.companyRepository.getAll();
        return companies.map(company => this.mapToResponseDto(company));
    }

    async getById(id: string): Promise<CompanyResponseDto> {
        const company = await this.companyRepository.getById(id);
        if (!company) {
            throw new CompanyNotFoundException();
        }

        return this.mapToResponseDto(company);
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto> {

        const existingCompany = await this.companyRepository.getById(id);
        if (!existingCompany) {
            throw new CompanyNotFoundException();
        }

        if (updateCompanyDto.name && updateCompanyDto.name !== existingCompany.name) {
            const existingByName = await this.companyRepository.findByName(updateCompanyDto.name);
            if (existingByName) {
                throw new CompanyAlreadyExistsException('name', updateCompanyDto.name);
            }
        }

        if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== existingCompany.cnpj) {
            const existingByCnpj = await this.companyRepository.findByCnpj(updateCompanyDto.cnpj);
            if (existingByCnpj) {
                throw new CompanyAlreadyExistsException('CNPJ', updateCompanyDto.cnpj);
            }
        }

        const updateData = {
            ...updateCompanyDto,
            updatedAt: new Date(),
        };

        const company = await this.companyRepository.update(id, updateData);
        return this.mapToResponseDto(company);
    }

    async remove(id: string): Promise<void> {
        const existingCompany = await this.companyRepository.getById(id);
        if (!existingCompany) {
            throw new CompanyNotFoundException();
        }

        await this.companyRepository.delete(id);
    }

    private mapToResponseDto(company: any): CompanyResponseDto {
        return {
            id: company.id,
            name: company.name,
            cnpj: company.cnpj,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        };
    }
}
