import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CardResponseDto } from './dto/card-response.dto';
import { CreateCardDto, UpdateCardDto } from './dto/create-card.dto';

@Controller('cards')
@ApiTags('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cartón por ID' })
  @ApiResponse({ status: 200, description: 'Cartón encontrado', type: CardResponseDto })
  @ApiResponse({ status: 404, description: 'Cartón no encontrado' })
  findOne(@Param('id') id: string) {
    return this.cardsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cartón' })
  @ApiResponse({ status: 201, description: 'Cartón creado exitosamente', type: CardResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Bingo no encontrado' })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cartón' })
  @ApiResponse({ status: 200, description: 'Cartón actualizado', type: CardResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cartón no encontrado' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cartón' })
  @ApiResponse({ status: 200, description: 'Cartón eliminado' })
  @ApiResponse({ status: 404, description: 'Cartón no encontrado' })
  delete(@Param('id') id: string) {
    return this.cardsService.delete(id);
  }
}
