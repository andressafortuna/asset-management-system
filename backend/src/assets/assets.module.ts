import { Module } from '@nestjs/common';
import { AssetController } from './controllers/asset.controller';
import { AssetService } from './services/asset.service';
import { AssetRepository } from './repositories/asset.repository';
import { EmployeeRepository } from '../employees/repositories/employee.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository, EmployeeRepository],
  exports: [AssetService, AssetRepository],
})
export class AssetsModule {}
