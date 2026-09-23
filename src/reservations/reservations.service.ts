import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  ReservationResponseDto,
} from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReservationDto): Promise<ReservationResponseDto> {
    const DEFAULT_EXPIRES_IN_MS = 10 * 60 * 1000; // 10 minutes
    const expiresInMs = data.expiresInMs || DEFAULT_EXPIRES_IN_MS;

    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${data.customerId} no encontrado`);
    }

    // Validate card exists and is available
    const card = await this.prisma.bingoCard.findUnique({
      where: { id: data.cardId },
    });

    if (!card) {
      throw new NotFoundException(`Cartón con ID ${data.cardId} no encontrado`);
    }

    if (card.status !== 'AVAILABLE') {
      throw new BadRequestException(
        `Cartón ${data.cardId} no está disponible (estado: ${card.status})`,
      );
    }

    // Use transaction with SERIALIZABLE isolation level to prevent double-reservation
    const reservation = await this.prisma.$transaction(
      async (tx) => {
        // Lock the card row to prevent concurrent modifications
        const lockedCard = await tx.bingoCard.findUnique({
          where: { id: data.cardId },
        });

        if (!lockedCard || lockedCard.status !== 'AVAILABLE') {
          throw new ConflictException(
            `Cartón ${data.cardId} fue reservado por otro cliente`,
          );
        }

        // Check if card already has an active reservation
        const existingReservation = await tx.reservation.findUnique({
          where: { cardId: data.cardId },
        });

        if (existingReservation && existingReservation.expiresAt > new Date()) {
          throw new ConflictException(
            `Cartón ${data.cardId} ya tiene una reserva activa`,
          );
        }

        // Create reservation
        const expiresAt = new Date(Date.now() + expiresInMs);
        const newReservation = await tx.reservation.create({
          data: {
            cardId: data.cardId,
            expiresAt,
          },
        });

        // Update card status to RESERVED
        await tx.bingoCard.update({
          where: { id: data.cardId },
          data: { status: 'RESERVED' },
        });

        return newReservation;
      },
      {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 30000,
      },
    );

    return this.toResponseDto(reservation);
  }

  async findByCardId(cardId: string): Promise<ReservationResponseDto | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { cardId },
    });

    return reservation ? this.toResponseDto(reservation) : null;
  }

  async findById(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return this.toResponseDto(reservation);
  }

  async findByCustomerId(customerId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        order: {
          customerId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations.map((r) => this.toResponseDto(r));
  }

  async expireReservations(): Promise<{ expired: number }> {
    const now = new Date();

    const expiredReservations = await this.prisma.reservation.findMany({
      where: {
        expiresAt: { lte: now },
        orderId: null, // Only expire reservations without orders
      },
    });

    if (expiredReservations.length === 0) {
      return { expired: 0 };
    }

    await this.prisma.$transaction(
      expiredReservations.map((reservation) =>
        this.prisma.bingoCard.update({
          where: { id: reservation.cardId },
          data: { status: 'AVAILABLE' },
        }),
      ),
    );

    // Delete expired reservations
    await this.prisma.reservation.deleteMany({
      where: {
        id: { in: expiredReservations.map((r) => r.id) },
      },
    });

    return { expired: expiredReservations.length };
  }

  private toResponseDto(reservation: any): ReservationResponseDto {
    const now = new Date();
    return {
      id: reservation.id,
      cardId: reservation.cardId,
      orderId: reservation.orderId,
      expiresAt: reservation.expiresAt,
      createdAt: reservation.createdAt,
      isValid: reservation.expiresAt > now,
    };
  }
}
