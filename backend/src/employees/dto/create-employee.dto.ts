import { IsString, IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Nome do funcionário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do funcionário',
    example: 'joao.silva@forte.com.br',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'CPF do funcionário',
    example: '123.456.789-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX',
  })
  cpf: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}
