// src/wishlist/wishlist.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishlistService } from './service/wishlist.service';
import { WishlistController } from './controller/wishlist.controller';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductVariant } from '../products/variants/entities/product-variant.entity';
import { CartModule } from '../cart/cart.module';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wishlist,
      ProductEntity,
      ProductVariant, // <-- Register ProductVariant for repository injection
      User,
    ]),
    CartModule,
    AccessControlModule,
  ],
  providers: [
    WishlistService,
    // CartService, // Only add if CartService is not already in the CartModule's exports (usually you just import CartModule)
  ],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}
