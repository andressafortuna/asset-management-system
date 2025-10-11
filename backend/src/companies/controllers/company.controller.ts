import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UsePipes,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, } from '@nestjs/swagger';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';

@ApiTags('Empresas')
@Controller('companies')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar uma nova empresa' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiResponse({
        status: 201,
        description: 'Empresa criada com sucesso',
        type: CompanyResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe uma empresa com o mesmo nome ou CNPJ',
    })
    async create(@Body() createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto> {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as empresas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todas as empresas',
        type: [CompanyResponseDto],
    })
    async getAll(): Promise<CompanyResponseDto[]> {
        return this.companyService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar empresa por ID' })
    @ApiParam({ name: 'id', description: 'ID da empresa' })
    @ApiResponse({
        status: 200,
        description: 'Empresa encontrada',
        type: CompanyResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Empresa não encontrada',
    })
    async getById(@Param('id') id: string): Promise<CompanyResponseDto> {
        return this.companyService.getById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar empresa' })
    @ApiParam({ name: 'id', description: 'ID da empresa' })
    @ApiBody({ type: UpdateCompanyDto })
    @ApiResponse({
        status: 200,
        description: 'Empresa atualizada com sucesso',
        type: CompanyResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'Empresa não encontrada',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe uma empresa com o mesmo nome ou CNPJ',
    })
    async update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ): Promise<CompanyResponseDto> {
        return this.companyService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar empresa' })
    @ApiParam({ name: 'id', description: 'ID da empresa' })
    @ApiResponse({
        status: 204,
        description: 'Empresa deletada com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Empresa não encontrada',
    })
    async remove(@Param('id') id: string): Promise<void> {
        return this.companyService.remove(id);
    }
}
