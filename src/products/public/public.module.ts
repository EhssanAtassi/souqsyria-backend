import { Module } from '@nestjs/common';
import { PublicProductsController } from './controller/public-products.controller';
import { PublicProductsService } from './service/public-products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [PublicProductsController],
  providers: [PublicProductsService],
})
export class PublicModule {}
