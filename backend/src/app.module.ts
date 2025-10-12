import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [PrismaModule, CompaniesModule, EmployeesModule, AssetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
