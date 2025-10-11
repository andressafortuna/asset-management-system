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
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeResponseDto } from '../dto/employee-response.dto';

@ApiTags('Funcionários')
@Controller('employees')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar um novo funcionário' })
    @ApiBody({ type: CreateEmployeeDto })
    @ApiResponse({
        status: 201,
        description: 'Funcionário criado com sucesso',
        type: EmployeeResponseDto,
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
        description: 'Já existe um funcionário com o mesmo email ou CPF',
    })
    async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
        return this.employeeService.create(createEmployeeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os funcionários' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todos os funcionários',
        type: [EmployeeResponseDto],
    })
    async getAll(): Promise<EmployeeResponseDto[]> {
        return this.employeeService.getAll();
    }

    @Get('company/:companyId')
    @ApiOperation({ summary: 'Listar funcionários de uma empresa' })
    @ApiParam({ name: 'companyId', description: 'ID da empresa' })
    @ApiResponse({
        status: 200,
        description: 'Lista de funcionários da empresa',
        type: [EmployeeResponseDto],
    })
    @ApiResponse({
        status: 404,
        description: 'Empresa não encontrada',
    })
    async getByCompanyId(@Param('companyId') companyId: string): Promise<EmployeeResponseDto[]> {
        return this.employeeService.getByCompanyId(companyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar funcionário por ID' })
    @ApiParam({ name: 'id', description: 'ID do funcionário' })
    @ApiResponse({
        status: 200,
        description: 'Funcionário encontrado',
        type: EmployeeResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Funcionário não encontrado',
    })
    async getById(@Param('id') id: string): Promise<EmployeeResponseDto> {
        return this.employeeService.getById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar funcionário' })
    @ApiParam({ name: 'id', description: 'ID do funcionário' })
    @ApiBody({ type: UpdateEmployeeDto })
    @ApiResponse({
        status: 200,
        description: 'Funcionário atualizado com sucesso',
        type: EmployeeResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'Funcionário ou empresa não encontrada',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe um funcionário com o mesmo email ou CPF',
    })
    async update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<EmployeeResponseDto> {
        return this.employeeService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar funcionário' })
    @ApiParam({ name: 'id', description: 'ID do funcionário' })
    @ApiResponse({
        status: 204,
        description: 'Funcionário deletado com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Funcionário não encontrado',
    })
    async remove(@Param('id') id: string): Promise<void> {
        return this.employeeService.remove(id);
    }
}
