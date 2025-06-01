import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WishlistService } from '../service/wishlist.service';
import { CreateWishlistDto } from '../dto/create-wishlist.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { PermissionsGuard } from '../../access-control/guards/permissions.guard';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /**
   * @route POST /wishlist
   * @description Add a product or variant to the current user's wishlist
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add product or variant to wishlist' })
  async add(@CurrentUser() user: User, @Body() body: CreateWishlistDto) {
    return this.wishlistService.addToWishlist(
      user,
      body.productId,
      body.productVariantId,
    );
  }

  /**
   * @route GET /wishlist
   * @description Get all wishlist items for the current user
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wishlist' })
  async getAll(@CurrentUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  /**
   * @route DELETE /wishlist/:productId
   * @description Remove a product (and optional variant) from wishlist
   * (If using variant-level, supply both IDs as query or path param)
   */
  @Delete(':productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove product (or variant) from wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({ name: 'productVariantId', required: false, type: Number })
  async remove(
    @CurrentUser() user: User,
    @Param('productId') productId: number,
    @Query('productVariantId') productVariantId?: number,
  ) {
    return this.wishlistService.removeFromWishlist(
      user,
      Number(productId),
      productVariantId ? Number(productVariantId) : undefined,
    );
  }

  /**
   * @route POST /wishlist/:id/move-to-cart
   * @description Move a wishlist item to cart (by wishlist item ID)
   */
  @Post(':id/move-to-cart')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Move wishlist item to cart' })
  @ApiParam({ name: 'id', description: 'Wishlist item ID' })
  async moveToCart(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Query('quantity') quantity: number = 1,
  ) {
    return this.wishlistService.moveToCart(
      user,
      Number(id),
      quantity ? Number(quantity) : 1,
    );
  }

  /**
   * @route PATCH /wishlist/:id/share
   * @description Generates a public share token for a wishlist item (owner only)
   */
  @Patch(':id/share')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate a public share token for wishlist item' })
  @ApiParam({ name: 'id', description: 'Wishlist item ID' })
  async generateShareToken(@CurrentUser() user: User, @Param('id') id: number) {
    return this.wishlistService.generateShareToken(user, Number(id));
  }

  /**
   * @route GET /public/wishlist/:shareToken
   * @description View a wishlist item by public share token
   */
  @Get('/public/wishlist/:shareToken')
  @ApiOperation({ summary: 'View a wishlist item by public share token' })
  @ApiParam({ name: 'shareToken', description: 'Wishlist share token' })
  async getByShareToken(@Param('shareToken') shareToken: string) {
    return this.wishlistService.getWishlistByShareToken(shareToken);
  }

  /**
   * @route GET /admin/wishlist/analytics
   * @description Admin endpoint: Returns stats about wishlists (total, top products, active users)
   */
  @Get('/admin/wishlist/analytics')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Get wishlist analytics (admin only)' })
  async getWishlistAnalytics() {
    return this.wishlistService.getWishlistAnalytics();
  }
}
