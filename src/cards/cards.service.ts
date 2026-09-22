import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CardResponseDto,
  PaginatedCardsDto,
} from './dto/card-response.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async findByBingo(
    bingoId: string,
    page: number = 1,
    limit: number = 50,
    status?: string,
    search?: string,
  ): Promise<PaginatedCardsDto> {
    // Verificar que el bingo existe
    const bingo = await this.prisma.bingo.findUnique({
      where: { id: bingoId },
    });

    if (!bingo) {
      throw new NotFoundException(`Bingo con ID ${bingoId} no encontrado`);
    }

    const skip = (page - 1) * limit;

    const where: any = { bingoId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.cardNumber = {
        contains: search,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.bingoCard.findMany({
        where,
        skip,
        take: limit,
        include: {
          cardNumbers: {
            orderBy: { number: 'asc' },
          },
        },
        orderBy: { cardNumber: 'asc' },
      }),
      this.prisma.bingoCard.count({ where }),
    ]);

    return {
      data: data.map((card) => this.mapToResponseDto(card)),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAvailable(
    bingoId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedCardsDto> {
    return this.findByBingo(bingoId, page, limit, 'AVAILABLE');
  }

  async findById(id: string): Promise<CardResponseDto> {
    const card = await this.prisma.bingoCard.findUnique({
      where: { id },
      include: {
        cardNumbers: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!card) {
      throw new NotFoundException(`Cartón con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(card);
  }

  async findByNumber(
    bingoId: string,
    cardNumber: string,
  ): Promise<CardResponseDto> {
    const card = await this.prisma.bingoCard.findFirst({
      where: { bingoId, cardNumber },
      include: {
        cardNumbers: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!card) {
      throw new NotFoundException(
        `Cartón ${cardNumber} no encontrado en el bingo ${bingoId}`,
      );
    }

    return this.mapToResponseDto(card);
  }

  private mapToResponseDto(card: any): CardResponseDto {
    return {
      id: card.id,
      cardNumber: card.cardNumber,
      status: card.status,
      numbers: card.cardNumbers.map((cn: any) => cn.number),
    };
  }
}
