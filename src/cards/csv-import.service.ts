import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { PrismaService } from '../prisma/prisma.service';
import { ImportCardsResponseDto } from './dto/import-cards.dto';

interface CsvCard {
  cardNumber: string;
  numbers: number[];
}

interface ParseError {
  row: number;
  cardNumber: string;
  error: string;
}

@Injectable()
export class CardsImportService {
  constructor(private prisma: PrismaService) {}

  async importFromCsv(
    file: Express.Multer.File,
    bingoId: string,
  ): Promise<ImportCardsResponseDto> {
    if (!file) {
      throw new BadRequestException('Archivo CSV requerido');
    }

    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('El archivo debe ser CSV');
    }

    // Verificar que el bingo existe
    const bingo = await this.prisma.bingo.findUnique({
      where: { id: bingoId },
    });

    if (!bingo) {
      throw new BadRequestException(`Bingo con ID ${bingoId} no encontrado`);
    }

    const cards: CsvCard[] = [];
    const errors: ParseError[] = [];
    let rowNumber = 0;

    // Parsear el CSV
    return new Promise((resolve, reject) => {
      Readable.from([file.buffer])
        .pipe(csvParser())
        .on('data', (row: any) => {
          rowNumber++;

          // Validar que tenga las columnas necesarias
          if (!row.cardNumber || !row.numbers) {
            errors.push({
              row: rowNumber,
              cardNumber: row.cardNumber || 'DESCONOCIDO',
              error: 'Columnas requeridas: cardNumber, numbers',
            });
            return;
          }

          const cardNumber = String(row.cardNumber).trim();
          const numbersStr = String(row.numbers).trim();

          // Parsear números
          let numbers: number[] = [];
          try {
            // Soporta formatos: "1,2,3,4,5,6,7,8,9,10" o "1 2 3 4 5 6 7 8 9 10"
            const separator = numbersStr.includes(',') ? ',' : ' ';
            numbers = numbersStr
              .split(separator)
              .map((n) => parseInt(n.trim(), 10))
              .filter((n) => !isNaN(n));
          } catch (err) {
            errors.push({
              row: rowNumber,
              cardNumber,
              error: 'Números inválidos: debe ser CSV o separado por espacios',
            });
            return;
          }

          // Validar cantidad de números
          if (numbers.length !== 10) {
            errors.push({
              row: rowNumber,
              cardNumber,
              error: `El cartón debe tener exactamente 10 números, se encontraron ${numbers.length}`,
            });
            return;
          }

          // Validar rango de números
          if (!numbers.every((n) => n >= 1 && n <= 90)) {
            errors.push({
              row: rowNumber,
              cardNumber,
              error: 'Los números deben estar entre 1 y 90',
            });
            return;
          }

          // Validar números duplicados en el cartón
          const uniqueNumbers = new Set(numbers);
          if (uniqueNumbers.size !== numbers.length) {
            errors.push({
              row: rowNumber,
              cardNumber,
              error: 'El cartón no puede tener números duplicados',
            });
            return;
          }

          cards.push({ cardNumber, numbers });
        })
        .on('end', async () => {
          try {
            const result = await this.processBatch(bingoId, cards, errors);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error: Error) => {
          reject(new BadRequestException(`Error al parsear CSV: ${error.message}`));
        });
    });
  }

  private async processBatch(
    bingoId: string,
    cards: CsvCard[],
    errors: ParseError[],
  ): Promise<ImportCardsResponseDto> {
    let imported = 0;

    // Procesar en transacción por lotes de 1000 registros
    const batchSize = 1000;

    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);

      try {
        await this.prisma.$transaction(async (tx) => {
          for (let j = 0; j < batch.length; j++) {
            const card = batch[j];
            const rowNumber = i + j + 1; // +1 porque es 0-indexed

            try {
              // Verificar que el cartón no existe
              const existing = await tx.bingoCard.findFirst({
                where: {
                  bingoId,
                  cardNumber: card.cardNumber,
                },
              });

              if (existing) {
                errors.push({
                  row: rowNumber,
                  cardNumber: card.cardNumber,
                  error: 'El cartón ya existe en este bingo',
                });
                continue;
              }

              // Crear cartón
              await tx.bingoCard.create({
                data: {
                  cardNumber: card.cardNumber,
                  bingoId,
                  status: 'AVAILABLE',
                  cardNumbers: {
                    createMany: {
                      data: card.numbers.map((num) => ({
                        number: num,
                      })),
                    },
                  },
                },
              });

              imported++;
            } catch (error) {
              errors.push({
                row: rowNumber,
                cardNumber: card.cardNumber,
                error: `Error al insertar: ${(error as Error).message}`,
              });
            }
          }
        });
      } catch (error) {
        throw new BadRequestException(
          `Error en transacción de lote: ${(error as Error).message}`,
        );
      }
    }

    return {
      total: cards.length,
      imported,
      failed: errors.length,
      errors,
      importedAt: new Date().toISOString(),
    };
  }
}
