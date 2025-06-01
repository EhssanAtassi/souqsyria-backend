/**
 * 🧭 CartController (Typed)
 *
 * Exposes endpoints for cart management using @CurrentUser().
 * Ensures clean, secure access to the user's cart operations.
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Logger,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserFromToken } from 'src/common/interfaces/user-from-token.interface';
import { PermissionsGuard } from '../../access-control/guards/permissions.guard';
import { CartService } from '../service/cart.service';
import { CreateCartItemDto } from '../dto/CreateCartItem.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  async getCart(@CurrentUser() user: UserFromToken) {
    this.logger.log(`Fetching cart for user ID: ${user.id}`);
    return this.cartService.getOrCreateCart(user);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  async addItem(
    @CurrentUser() user: UserFromToken,
    @Body() dto: CreateCartItemDto,
  ) {
    this.logger.log(`User ${user.id} is adding item to cart`);
    return this.cartService.addItemToCart(user, dto);
  }

  @Delete('item/:variantId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(
    @CurrentUser() user: UserFromToken,
    @Param('variantId') variantId: number,
  ) {
    this.logger.log(`User ${user.id} is removing variant ID ${variantId}`);
    return this.cartService.removeItem(user, variantId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@CurrentUser() user: UserFromToken) {
    this.logger.log(`User ${user.id} is clearing their cart`);
    return this.cartService.clearCart(user);
  }
}
