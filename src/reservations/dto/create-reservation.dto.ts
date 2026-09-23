import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  @IsString()
  @IsNotEmpty()
  cardId!: string;

  @ApiProperty({
    example: 600000,
    description: 'Duración de la reserva en milisegundos (default: 10 min = 600000ms)',
    required: false,
  })
  @IsOptional()
  expiresInMs?: number;
}

export class ReservationResponseDto {
  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  id!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  cardId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq', nullable: true })
  orderId: string | null = null;

  @ApiProperty({ example: '2026-09-22T22:53:47.094Z' })
  expiresAt!: Date;

  @ApiProperty({ example: '2026-09-22T22:43:47.094Z' })
  createdAt!: Date;

  @ApiProperty({
    example: true,
    description: 'True si la reserva aún es válida (no ha expirado)',
  })
  isValid!: boolean;
}
