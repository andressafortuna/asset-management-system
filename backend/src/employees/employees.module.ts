import { Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { CompanyRepository } from '../companies/repositories/company.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository, CompanyRepository],
  exports: [EmployeeService, EmployeeRepository],
})
export class EmployeesModule {}
