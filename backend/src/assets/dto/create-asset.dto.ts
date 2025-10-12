import { IsString, IsNotEmpty, IsEnum, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AssetStatus {
  DISPONIVEL = 'Disponível',
  EM_USO = 'Em Uso',
  EM_MANUTENCAO = 'Em Manutenção',
}

export class CreateAssetDto {
  @ApiProperty({
    description: 'Nome do ativo',
    example: 'Notebook Dell Inspiron',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Tipo do ativo',
    example: 'Notebook',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'Tipo deve ter entre 2 e 50 caracteres' })
  type: string;

  @ApiProperty({
    description: 'Status do ativo',
    example: 'Disponível',
    enum: AssetStatus,
  })
  @IsEnum(AssetStatus, { message: 'Status deve ser: Disponível, Em Uso ou Em Manutenção' })
  status: AssetStatus;
}
