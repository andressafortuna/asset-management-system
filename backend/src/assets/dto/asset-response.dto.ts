import { ApiProperty } from '@nestjs/swagger';
import { AssetStatus } from './create-asset.dto';

export class AssetResponseDto {
  @ApiProperty({
    description: 'Identificador único do ativo',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do ativo',
    example: 'Notebook Dell Inspiron',
  })
  name: string;

  @ApiProperty({
    description: 'Tipo do ativo',
    example: 'Notebook',
  })
  type: string;

  @ApiProperty({
    description: 'Status do ativo',
    example: 'Disponível',
    enum: ['Disponível', 'Em Uso', 'Em Manutenção'],
  })
  status: string;

  @ApiProperty({
    description: 'ID do funcionário associado (se houver)',
    example: 'clx1234567890abcdef',
    required: false,
  })
  employeeId?: string;

  @ApiProperty({
    description: 'Data de criação do ativo',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do ativo',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
