import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AttributesService } from './attributes.service';

@ApiTags('Product Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({ status: 200, description: 'Returns all product attributes' })
  findAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  @ApiParam({ name: 'id', description: 'Attribute ID' })
  @ApiResponse({ status: 200, description: 'Returns attribute details' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(+id);
  }

  @Get(':id/values')
  @ApiOperation({ summary: 'Get attribute values by attribute ID' })
  @ApiParam({ name: 'id', description: 'Attribute ID' })
  @ApiResponse({ status: 200, description: 'Returns all values for the attribute' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  findAttributeValues(@Param('id') id: string) {
    return this.attributesService.findAttributeValues(+id);
  }
}