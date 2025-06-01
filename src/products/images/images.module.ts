import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ProductEntity } from '../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from '../entities/product-image.entity';
import { AccessControlModule } from '../../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImage]),
    AccessControlModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
