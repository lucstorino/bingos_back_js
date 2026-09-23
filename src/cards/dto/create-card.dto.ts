import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber, Min, Max, IsOptional, IsEnum } from 'class-validator';

enum CardStatusEnum {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  CANCELLED = 'CANCELLED',
}

export class CreateCardDto {
  @ApiProperty({ example: 'cmubycgc900028liz9uih26m3', description: 'ID del bingo' })
  @IsString()
  @IsNotEmpty()
  bingoId!: string;

  @ApiProperty({ example: '14600001', description: 'Número único del cartón' })
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @ApiProperty({ 
    example: [2, 5, 24, 39, 42, 46, 51, 53, 72, 86], 
    description: 'Array de 10 números entre 1 y 90',
    type: [Number] 
  })
  @IsArray()
  @ArrayMinSize(10, { message: 'El cartón debe tener exactamente 10 números' })
  @ArrayMaxSize(10, { message: 'El cartón debe tener exactamente 10 números' })
  @IsNumber({}, { each: true })
  @Min(1, { each: true, message: 'Los números deben estar entre 1 y 90' })
  @Max(90, { each: true, message: 'Los números deben estar entre 1 y 90' })
  numbers!: number[];

  @ApiProperty({ example: 'AVAILABLE', description: 'Estado del cartón', required: false, enum: CardStatusEnum })
  @IsOptional()
  @IsEnum(CardStatusEnum)
  status?: CardStatusEnum;
}

export class UpdateCardDto {
  @ApiProperty({ example: '14600001', description: 'Número del cartón', required: false })
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @ApiProperty({ 
    example: [2, 5, 24, 39, 42, 46, 51, 53, 72, 86], 
    description: 'Array de 10 números entre 1 y 90',
    type: [Number],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(10, { message: 'El cartón debe tener exactamente 10 números' })
  @ArrayMaxSize(10, { message: 'El cartón debe tener exactamente 10 números' })
  @IsNumber({}, { each: true })
  @Min(1, { each: true, message: 'Los números deben estar entre 1 y 90' })
  @Max(90, { each: true, message: 'Los números deben estar entre 1 y 90' })
  numbers?: number[];

  @ApiProperty({ example: 'AVAILABLE', description: 'Estado del cartón', required: false, enum: CardStatusEnum })
  @IsOptional()
  @IsEnum(CardStatusEnum)
  status?: CardStatusEnum;
}

export { CardStatusEnum };
