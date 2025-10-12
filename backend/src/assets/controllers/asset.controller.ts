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
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, } from '@nestjs/swagger';
import { AssetService } from '../services/asset.service';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { AssetResponseDto } from '../dto/asset-response.dto';

@ApiTags('Ativos')
@Controller('assets')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AssetController {
    constructor(private readonly assetService: AssetService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar um novo ativo' })
    @ApiBody({ type: CreateAssetDto })
    @ApiResponse({
        status: 201,
        description: 'Ativo criado com sucesso',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe um ativo com o mesmo nome',
    })
    async create(@Body() createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
        return this.assetService.create(createAssetDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os ativos' })
    @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
    @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todos os ativos',
        type: [AssetResponseDto],
    })
    async getAll(
        @Query('status') status?: string,
        @Query('type') type?: string,
    ): Promise<AssetResponseDto[]> {
        if (status) {
            return this.assetService.getByStatus(status);
        }
        if (type) {
            return this.assetService.getByType(type);
        }
        return this.assetService.getAll();
    }

    @Get('available')
    @ApiOperation({ summary: 'Listar ativos disponíveis' })
    @ApiResponse({
        status: 200,
        description: 'Lista de ativos disponíveis',
        type: [AssetResponseDto],
    })
    async getAvailableAssets(): Promise<AssetResponseDto[]> {
        return this.assetService.getAvailableAssets();
    }

    @Get('employee/:employeeId')
    @ApiOperation({ summary: 'Listar ativos de um funcionário' })
    @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
    @ApiResponse({
        status: 200,
        description: 'Lista de ativos do funcionário',
        type: [AssetResponseDto],
    })
    @ApiResponse({
        status: 404,
        description: 'Funcionário não encontrado',
    })
    async getByEmployeeId(@Param('employeeId') employeeId: string): Promise<AssetResponseDto[]> {
        return this.assetService.getByEmployeeId(employeeId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar ativo por ID' })
    @ApiParam({ name: 'id', description: 'ID do ativo' })
    @ApiResponse({
        status: 200,
        description: 'Ativo encontrado',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Ativo não encontrado',
    })
    async getById(@Param('id') id: string): Promise<AssetResponseDto> {
        return this.assetService.getById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar ativo' })
    @ApiParam({ name: 'id', description: 'ID do ativo' })
    @ApiBody({ type: UpdateAssetDto })
    @ApiResponse({
        status: 200,
        description: 'Ativo atualizado com sucesso',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'Ativo não encontrado',
    })
    @ApiResponse({
        status: 409,
        description: 'Já existe um ativo com o mesmo nome',
    })
    async update(
        @Param('id') id: string,
        @Body() updateAssetDto: UpdateAssetDto,
    ): Promise<AssetResponseDto> {
        return this.assetService.update(id, updateAssetDto);
    }

    @Post(':id/associate/:employeeId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Associar ativo a um funcionário' })
    @ApiParam({ name: 'id', description: 'ID do ativo' })
    @ApiParam({ name: 'employeeId', description: 'ID do funcionário' })
    @ApiResponse({
        status: 200,
        description: 'Ativo associado com sucesso',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Ativo não está disponível',
    })
    @ApiResponse({
        status: 404,
        description: 'Ativo ou funcionário não encontrado',
    })
    @ApiResponse({
        status: 409,
        description: 'Funcionário já possui um notebook associado',
    })
    async associateAsset(
        @Param('id') id: string,
        @Param('employeeId') employeeId: string,
    ): Promise<AssetResponseDto> {
        return this.assetService.associateAsset(id, employeeId);
    }

    @Post(':id/disassociate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desassociar ativo de um funcionário' })
    @ApiParam({ name: 'id', description: 'ID do ativo' })
    @ApiResponse({
        status: 200,
        description: 'Ativo desassociado com sucesso',
        type: AssetResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Ativo não está em uso',
    })
    @ApiResponse({
        status: 404,
        description: 'Ativo não encontrado',
    })
    async disassociateAsset(@Param('id') id: string): Promise<AssetResponseDto> {
        return this.assetService.disassociateAsset(id);
    }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar ativo' })
  @ApiParam({ name: 'id', description: 'ID do ativo' })
  @ApiResponse({
    status: 204,
    description: 'Ativo deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ativo está associado a um funcionário. Desassocie primeiro',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.assetService.remove(id);
  }
}
