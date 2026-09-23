import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
  OrderStatusEnum,
} from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto): Promise<OrderResponseDto> {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${data.customerId} no encontrado`);
    }

    // Validate bingo exists
    const bingo = await this.prisma.bingo.findUnique({
      where: { id: data.bingoId },
    });

    if (!bingo) {
      throw new NotFoundException(`Bingo con ID ${data.bingoId} no encontrado`);
    }

    // Validate card exists and belongs to the bingo
    const card = await this.prisma.bingoCard.findUnique({
      where: { id: data.cardId },
    });

    if (!card) {
      throw new NotFoundException(`Cartón con ID ${data.cardId} no encontrado`);
    }

    if (card.bingoId !== data.bingoId) {
      throw new BadRequestException(
        `Cartón ${data.cardId} no pertenece al Bingo ${data.bingoId}`,
      );
    }

    // Create order with reservation in a transaction
    const order = await this.prisma.$transaction(
      async (tx) => {
        // Lock card to prevent concurrent operations
        const lockedCard = await tx.bingoCard.findUnique({
          where: { id: data.cardId },
        });

        if (!lockedCard || lockedCard.status !== 'AVAILABLE') {
          throw new ConflictException(
            `Cartón ${data.cardId} no está disponible (estado: ${lockedCard?.status})`,
          );
        }

        // Create order first
        const newOrder = await tx.order.create({
          data: {
            customerId: data.customerId,
            bingoId: data.bingoId,
            cardId: data.cardId,
            amount: data.amount,
            status: 'PENDING',
          },
        });

        // Create reservation linked to the order
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await tx.reservation.create({
          data: {
            cardId: data.cardId,
            orderId: newOrder.id,
            expiresAt,
          },
        });

        // Update card status to RESERVED
        await tx.bingoCard.update({
          where: { id: data.cardId },
          data: { status: 'RESERVED' },
        });

        return newOrder;
      },
      {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 30000,
      },
    );

    return this.toResponseDto(order);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return this.toResponseDto(order);
  }

  async findByCustomerId(customerId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.toResponseDto(o));
  }

  async findByBingoId(bingoId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { bingoId },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.toResponseDto(o));
  }

  async updateStatus(id: string, data: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { reservation: true },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Determine new card status based on order status
    let cardStatus: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'CANCELLED' = 'RESERVED';
    if (data.status === 'PAID') {
      cardStatus = 'SOLD';
    } else if (data.status === 'CANCELLED' || data.status === 'EXPIRED') {
      cardStatus = 'AVAILABLE';
    }

    const updated = await this.prisma.$transaction(
      async (tx) => {
        // Update card status
        await tx.bingoCard.update({
          where: { id: order.cardId },
          data: { status: cardStatus },
        });

        // If order is cancelled/expired, delete the reservation
        if ((data.status === 'CANCELLED' || data.status === 'EXPIRED') && order.reservation) {
          await tx.reservation.delete({
            where: { id: order.reservation.id },
          });
        }

        return tx.order.update({
          where: { id },
          data: { status: data.status },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    return this.toResponseDto(updated);
  }

  async cancelExpiredOrders(): Promise<{ cancelled: number }> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lte: fiveMinutesAgo },
      },
      include: { reservation: true },
    });

    if (expiredOrders.length === 0) {
      return { cancelled: 0 };
    }

    // Process in a single transaction
    await this.prisma.$transaction(async (tx) => {
      for (const order of expiredOrders) {
        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'EXPIRED' },
        });

        // Update card status
        await tx.bingoCard.update({
          where: { id: order.cardId },
          data: { status: 'AVAILABLE' },
        });

        // Delete reservation
        if (order.reservation) {
          await tx.reservation.delete({
            where: { id: order.reservation.id },
          });
        }
      }
    }, {
      isolationLevel: 'Serializable',
    });

    return { cancelled: expiredOrders.length };
  }

  private toResponseDto(order: any): OrderResponseDto {
    return {
      id: order.id,
      customerId: order.customerId,
      bingoId: order.bingoId,
      cardId: order.cardId,
      amount: order.amount,
      status: order.status as OrderStatusEnum,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
