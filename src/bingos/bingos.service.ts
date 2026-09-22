import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBingoDto,
  UpdateBingoDto,
  BingoResponseDto,
  PaginatedBingosDto,
  BingoStatusEnum,
} from './dto/create-bingo.dto';

@Injectable()
export class BingosService {
  constructor(private prisma: PrismaService) {}

  async create(createBingoDto: CreateBingoDto): Promise<BingoResponseDto> {
    const bingo = await this.prisma.bingo.create({
      data: {
        name: createBingoDto.name,
        description: createBingoDto.description,
        drawDate: new Date(createBingoDto.drawDate),
        price: createBingoDto.price,
        status: createBingoDto.status || BingoStatusEnum.DRAFT,
      },
    });

    return this.mapToResponseDto(bingo);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<PaginatedBingosDto> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.bingo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bingo.count({ where }),
    ]);

    return {
      data: data.map((bingo) => this.mapToResponseDto(bingo)),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<BingoResponseDto> {
    const bingo = await this.prisma.bingo.findUnique({
      where: { id },
    });

    if (!bingo) {
      throw new NotFoundException(`Bingo con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(bingo);
  }

  async update(
    id: string,
    updateBingoDto: UpdateBingoDto,
  ): Promise<BingoResponseDto> {
    await this.findById(id); // Verificar que existe

    const bingo = await this.prisma.bingo.update({
      where: { id },
      data: {
        name: updateBingoDto.name,
        description: updateBingoDto.description,
        drawDate: updateBingoDto.drawDate
          ? new Date(updateBingoDto.drawDate)
          : undefined,
        price: updateBingoDto.price,
        status: updateBingoDto.status,
      },
    });

    return this.mapToResponseDto(bingo);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verificar que existe

    await this.prisma.bingo.delete({
      where: { id },
    });
  }

  private mapToResponseDto(bingo: any): BingoResponseDto {
    return {
      id: bingo.id,
      name: bingo.name,
      description: bingo.description,
      drawDate: bingo.drawDate,
      price: Number(bingo.price),
      status: bingo.status,
      createdAt: bingo.createdAt,
      updatedAt: bingo.updatedAt,
    };
  }
}
