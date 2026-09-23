import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,10}$/, { message: 'DNI debe tener entre 6 y 10 dígitos' })
  dni!: string;

  @ApiProperty({ example: 'Calle Falsa 123' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\d+\-\s()]+$/, { message: 'Teléfono inválido' })
  phone!: string;

  @ApiProperty({ example: 'juan.perez@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ example: 'Juan', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Calle Falsa 123', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[\d+\-\s()]+$/, { message: 'Teléfono inválido' })
  phone?: string;

  @ApiProperty({ example: 'juan.perez@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CustomerResponseDto {
  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  id!: string;

  @ApiProperty({ example: 'Juan' })
  firstName!: string;

  @ApiProperty({ example: 'Pérez' })
  lastName!: string;

  @ApiProperty({ example: '12345678' })
  dni!: string;

  @ApiProperty({ example: 'Calle Falsa 123' })
  address!: string;

  @ApiProperty({ example: '0987654321' })
  phone!: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  email: string | null = null;

  @ApiProperty({ example: '2026-09-22T22:43:47.094Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-22T22:43:47.094Z' })
  updatedAt!: Date;
}
