import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CardResponseDto } from './dto/card-response.dto';

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
}
