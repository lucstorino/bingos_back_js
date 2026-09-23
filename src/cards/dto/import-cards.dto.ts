import { ApiProperty } from '@nestjs/swagger';

export class ImportCardsResponseDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 98 })
  imported!: number;

  @ApiProperty({ example: 2 })
  failed!: number;

  @ApiProperty({ 
    example: [
      { row: 5, cardNumber: '14600005', error: 'Números duplicados en el cartón' },
      { row: 12, cardNumber: '14600012', error: 'El cartón ya existe en este bingo' }
    ],
    description: 'Errores encontrados durante la importación'
  })
  errors!: Array<{ row: number; cardNumber: string; error: string }>;

  @ApiProperty({ example: '2024-03-15T10:30:00Z' })
  importedAt!: string;
}

export class CsvRowDto {
  cardNumber?: string;
  numbers?: string;
}
