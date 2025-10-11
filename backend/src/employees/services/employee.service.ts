import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CompanyRepository } from '../../companies/repositories/company.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeResponseDto } from '../dto/employee-response.dto';
import {
  EmployeeNotFoundException,
  EmployeeAlreadyExistsException,
  CompanyNotFoundException,
} from '../../common/exceptions/business.exception';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const company = await this.companyRepository.getById(createEmployeeDto.companyId);
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const existingByEmail = await this.employeeRepository.getByEmail(createEmployeeDto.email);
    if (existingByEmail) {
      throw new EmployeeAlreadyExistsException('email', createEmployeeDto.email);
    }

    const existingByCpf = await this.employeeRepository.getByCpf(createEmployeeDto.cpf);
    if (existingByCpf) {
      throw new EmployeeAlreadyExistsException('CPF', createEmployeeDto.cpf);
    }

    const employee = await this.employeeRepository.create({
      name: createEmployeeDto.name,
      email: createEmployeeDto.email,
      cpf: createEmployeeDto.cpf,
      company: {
        connect: { id: createEmployeeDto.companyId },
      },
    });

    return this.mapToResponseDto(employee);
  }

  async getAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.getAll();
    return employees.map(employee => this.mapToResponseDto(employee));
  }

  async getById(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.getById(id);
    if (!employee) {
      throw new EmployeeNotFoundException();
    }

    return this.mapToResponseDto(employee);
  }

  async getByCompanyId(companyId: string): Promise<EmployeeResponseDto[]> {
    const company = await this.companyRepository.getById(companyId);
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const employees = await this.employeeRepository.getByCompanyId(companyId);
    return employees.map(employee => this.mapToResponseDto(employee));
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const existingEmployee = await this.employeeRepository.getById(id);
    if (!existingEmployee) {
      throw new EmployeeNotFoundException();
    }

    if (updateEmployeeDto.companyId && updateEmployeeDto.companyId !== existingEmployee.companyId) {
      const company = await this.companyRepository.getById(updateEmployeeDto.companyId);
      if (!company) {
        throw new CompanyNotFoundException();
      }
    }

    if (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) {
      const existingByEmail = await this.employeeRepository.getByEmail(updateEmployeeDto.email);
      if (existingByEmail) {
        throw new EmployeeAlreadyExistsException('email', updateEmployeeDto.email);
      }
    }

    if (updateEmployeeDto.cpf && updateEmployeeDto.cpf !== existingEmployee.cpf) {
      const existingByCpf = await this.employeeRepository.getByCpf(updateEmployeeDto.cpf);
      if (existingByCpf) {
        throw new EmployeeAlreadyExistsException('CPF', updateEmployeeDto.cpf);
      }
    }

    const updateData = {
      ...updateEmployeeDto,
      updatedAt: new Date(),
    };

    const employee = await this.employeeRepository.update(id, updateData);
    return this.mapToResponseDto(employee);
  }

  async remove(id: string): Promise<void> {
    const existingEmployee = await this.employeeRepository.getById(id);
    if (!existingEmployee) {
      throw new EmployeeNotFoundException();
    }

    await this.employeeRepository.delete(id);
  }

  private mapToResponseDto(employee: any): EmployeeResponseDto {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      cpf: employee.cpf,
      companyId: employee.companyId,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }
}
