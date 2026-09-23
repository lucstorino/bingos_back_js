import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
} from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada', type: OrderResponseDto })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden encontrada', type: OrderResponseDto })
  async findById(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.ordersService.findById(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Obtener órdenes de un cliente' })
  @ApiParam({ name: 'customerId', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Órdenes del cliente', type: [OrderResponseDto] })
  async findByCustomerId(@Param('customerId') customerId: string): Promise<OrderResponseDto[]> {
    return this.ordersService.findByCustomerId(customerId);
  }

  @Get('bingo/:bingoId')
  @ApiOperation({ summary: 'Obtener órdenes de un bingo' })
  @ApiParam({ name: 'bingoId', description: 'ID del bingo' })
  @ApiResponse({ status: 200, description: 'Órdenes del bingo', type: [OrderResponseDto] })
  async findByBingoId(@Param('bingoId') bingoId: string): Promise<OrderResponseDto[]> {
    return this.ordersService.findByBingoId(bingoId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada', type: OrderResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Post('cancel-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar órdenes expiradas (para tareas cron)' })
  @ApiResponse({ status: 200, description: 'Órdenes canceladas', schema: { example: { cancelled: 5 } } })
  async cancelExpiredOrders(): Promise<{ cancelled: number }> {
    return this.ordersService.cancelExpiredOrders();
  }
}

