/**
 * 🧱 CartModule
 *
 * Defines the cart domain logic for SouqSyria.
 * Includes cart service, controller, and entity registration.
 */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartController } from './controller/cart.controller';
import { ProductVariant } from '../products/variants/entities/product-variant.entity';
import { CartService } from './service/cart.service';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, ProductVariant]),
    AccessControlModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
