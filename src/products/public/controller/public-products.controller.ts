import { Controller, Get, Query } from '@nestjs/common';
import { GetPublicProductsDto } from '../dto/get-public-products.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PublicProductsService } from '../service/public-products.service';

@Controller('controller')
export class PublicProductsController {
  constructor(private readonly service: PublicProductsService) {}

  /**
   * GET /products
   * Public catalog listing endpoint for customers
   * Supports pagination, search, price range, category/vendor filters
   */
  @Get()
  @ApiOperation({ summary: 'Public product feed for customers' })
  getPublicProducts(@Query() filters: GetPublicProductsDto) {
    return this.service.getPublicFeed(filters);
  }
}
