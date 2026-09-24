import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  ReservationResponseDto,
} from './dto/create-reservation.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada', type: ReservationResponseDto })
  async create(@Body() createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    return this.reservationsService.create(createReservationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: ReservationResponseDto })
  async findById(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.reservationsService.findById(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Obtener reservas de un cliente' })
  @ApiResponse({ status: 200, description: 'Reservas del cliente', type: [ReservationResponseDto] })
  async findByCustomerId(@Param('customerId') customerId: string): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findByCustomerId(customerId);
  }

  @Post('expire-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Expirar reservas vencidas (para tareas cron)' })
  @ApiResponse({ status: 200, description: 'Reservas expiradas', schema: { example: { expired: 5 } } })
  async expireReservations(): Promise<{ expired: number }> {
    return this.reservationsService.expireReservations();
  }
}

