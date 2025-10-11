import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Identificador único do funcionário',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do funcionário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do funcionário',
    example: 'joao.silva@forte.com.br',
  })
  email: string;

  @ApiProperty({
    description: 'CPF do funcionário',
    example: '123.456.789-00',
  })
  cpf: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: 'clx1234567890abcdef',
  })
  companyId: string;

  @ApiProperty({
    description: 'Data de criação do funcionário',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do funcionário',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
