import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'Identificador único da empresa',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Forte Tecnologias',
  })
  name: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
  })
  cnpj: string;

  @ApiProperty({
    description: 'Data de criação da empresa',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização da empresa',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
