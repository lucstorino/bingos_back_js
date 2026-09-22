import { ApiProperty } from '@nestjs/swagger';

export class CardNumberDto {
  @ApiProperty({ example: 'cmubycgc900028liz9uih26m3' })
  id!: string;

  @ApiProperty({ example: 42 })
  number!: number;
}

export class CardResponseDto {
  @ApiProperty({ example: 'cmubycgc900028liz9uih26m3' })
  id!: string;

  @ApiProperty({ example: '14600001' })
  cardNumber!: string;

  @ApiProperty({ example: 'AVAILABLE' })
  status!: string;

  @ApiProperty({ example: [2, 5, 24, 39, 42, 46, 51, 53, 72, 86], type: [Number] })
  numbers!: number[];
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  pages!: number;
}

export class PaginatedCardsDto {
  @ApiProperty({ type: [CardResponseDto] })
  data!: CardResponseDto[];

  @ApiProperty()
  meta!: PaginationMetaDto;
}
