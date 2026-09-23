import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDto): Promise<CustomerResponseDto> {
    // Check if customer with same DNI already exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { dni: data.dni },
    });

    if (existingCustomer) {
      throw new BadRequestException(`Cliente con DNI ${data.dni} ya existe`);
    }

    const customer = await this.prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        address: data.address,
        phone: data.phone,
        email: data.email || null,
      },
    });

    return this.toResponseDto(customer);
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return customers.map((c) => this.toResponseDto(c));
  }

  async findOne(id: string): Promise<CustomerResponseDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return this.toResponseDto(customer);
  }

  async update(id: string, data: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data: {
        firstName: data.firstName || customer.firstName,
        lastName: data.lastName || customer.lastName,
        address: data.address || customer.address,
        phone: data.phone || customer.phone,
        email: data.email || customer.email,
      },
    });

    return this.toResponseDto(updated);
  }

  async delete(id: string): Promise<{ message: string }> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: `Cliente ${id} eliminado exitosamente` };
  }

  private toResponseDto(customer: any): CustomerResponseDto {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      dni: customer.dni,
      address: customer.address,
      phone: customer.phone,
      email: customer.email,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
