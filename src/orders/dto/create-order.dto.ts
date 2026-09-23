import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  @IsString()
  @IsNotEmpty()
  bingoId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  @IsString()
  @IsNotEmpty()
  cardId!: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatusEnum, example: OrderStatusEnum.PAID })
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status!: OrderStatusEnum;
}

export class OrderResponseDto {
  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  id!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  customerId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  bingoId!: string;

  @ApiProperty({ example: 'cmudedyhv0000dvl6r0nzj7lq' })
  cardId!: string;

  @ApiProperty({ example: '5000.00' })
  amount!: Decimal;

  @ApiProperty({ enum: OrderStatusEnum, example: OrderStatusEnum.PENDING })
  status!: OrderStatusEnum;

  @ApiProperty({ example: '2026-09-22T22:43:47.094Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-22T22:43:47.094Z' })
  updatedAt!: Date;
}
