import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BingosService } from './bingos.service';
import { CreateBingoDto, UpdateBingoDto, PaginatedBingosDto, BingoResponseDto } from './dto/create-bingo.dto';
import { CardsService } from '../cards/cards.service';
import { PaginatedCardsDto } from '../cards/dto/card-response.dto';

@Controller('bingos')
@ApiTags('bingos')
export class BingosController {
  constructor(
    private readonly bingosService: BingosService,
    private readonly cardsService: CardsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo bingo' })
  @ApiResponse({ status: 201, description: 'Bingo creado exitosamente', type: BingoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBingoDto: CreateBingoDto) {
    return this.bingosService.create(createBingoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los bingos' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'ACTIVE' })
  @ApiResponse({ status: 200, description: 'Listado de bingos', type: PaginatedBingosDto })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    return this.bingosService.findAll(parseInt(page), parseInt(limit), status);
  }

  @Get(':bingoId/cards')
  @ApiOperation({ summary: 'Listar cartones de un bingo' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'AVAILABLE' })
  @ApiQuery({ name: 'search', required: false, example: '14600001' })
  @ApiResponse({ status: 200, description: 'Cartones del bingo', type: PaginatedCardsDto })
  @ApiResponse({ status: 404, description: 'Bingo no encontrado' })
  getCards(
    @Param('bingoId') bingoId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.cardsService.findByBingo(
      bingoId,
      parseInt(page),
      parseInt(limit),
      status,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un bingo por ID' })
  @ApiResponse({ status: 200, description: 'Bingo encontrado', type: BingoResponseDto })
  @ApiResponse({ status: 404, description: 'Bingo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.bingosService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un bingo' })
  @ApiResponse({ status: 200, description: 'Bingo actualizado', type: BingoResponseDto })
  @ApiResponse({ status: 404, description: 'Bingo no encontrado' })
  update(@Param('id') id: string, @Body() updateBingoDto: UpdateBingoDto) {
    return this.bingosService.update(id, updateBingoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un bingo' })
  @ApiResponse({ status: 200, description: 'Bingo eliminado' })
  @ApiResponse({ status: 404, description: 'Bingo no encontrado' })
  delete(@Param('id') id: string) {
    return this.bingosService.delete(id);
  }
}
