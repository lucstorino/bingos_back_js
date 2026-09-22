import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BingoStatusEnum {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export class CreateBingoDto {
  @ApiProperty({ example: 'Bingo Navidad 2026' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Bingo especial de Navidad con premios increíbles', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-12-25T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  drawDate!: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ enum: BingoStatusEnum, example: BingoStatusEnum.DRAFT, required: false })
  @IsEnum(BingoStatusEnum)
  @IsOptional()
  status?: BingoStatusEnum = BingoStatusEnum.DRAFT;
}

export class UpdateBingoDto {
  @ApiProperty({ example: 'Bingo Navidad 2026', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Bingo especial de Navidad con premios increíbles', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-12-25T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  drawDate?: string;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ enum: BingoStatusEnum, required: false })
  @IsEnum(BingoStatusEnum)
  @IsOptional()
  status?: BingoStatusEnum;
}

export class BingoResponseDto {
  @ApiProperty({ example: 'cmubycgbx00008liz1o86qg4m' })
  id!: string;

  @ApiProperty({ example: 'Bingo Navidad 2026' })
  name!: string;

  @ApiProperty({ example: 'Bingo especial de Navidad con premios increíbles' })
  description: string | null = null;

  @ApiProperty({ example: '2026-12-25T00:00:00.000Z' })
  drawDate!: Date;

  @ApiProperty({ example: 10000 })
  price!: number;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: '2026-09-22T00:44:56.110Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-22T00:44:56.110Z' })
  updatedAt!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 1 })
  total!: number;

  @ApiProperty({ example: 1 })
  pages!: number;
}

export class PaginatedBingosDto {
  @ApiProperty({ type: [BingoResponseDto] })
  data!: BingoResponseDto[];

  @ApiProperty()
  meta!: PaginationMetaDto;
}
