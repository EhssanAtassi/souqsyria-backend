/**
 * 🛒 CartService (Token-Based)
 *
 * Handles logic for managing user shopping carts using the decoded user token (UserFromToken).
 * This avoids unnecessary DB fetches and improves performance.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { ProductVariant } from '../../products/variants/entities/product-variant.entity';
import { UserFromToken } from '../../common/interfaces/user-from-token.interface';
import { CreateCartItemDto } from '../dto/CreateCartItem.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
  ) {}

  /**
   * Retrieves or creates the user's active cart.
   * Also runs lightweight validation on all cart items:
   * - Marks items as invalid if stock is zero, price has changed, or variant is inactive.
   */
  async getOrCreateCart(user: UserFromToken): Promise<Cart> {
    this.logger.log(`Looking up cart for user ID ${user.id}`);

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.variant', 'items.variant.stocks'],
    });

    if (!cart) {
      this.logger.log(`Creating new cart for user ID ${user.id}`);
      cart = this.cartRepo.create({ user: { id: user.id } as any, items: [] });
      await this.cartRepo.save(cart);
      return cart;
    }

    // 🔄 Validate each item
    let updated = false;
    for (const item of cart.items) {
      const variant = item.variant;

      const totalStock =
        variant.stocks?.reduce((sum, s) => sum + s.quantity, 0) || 0;

      const isValid =
        variant.isActive &&
        totalStock > 0 &&
        item.price_at_add === variant.price;

      if (item.valid !== isValid) {
        this.logger.warn(
          `Item ID ${item.id} validity changed: active=${variant.isActive}, stock=${totalStock}, price=${variant.price}`,
        );
        item.valid = isValid;
        updated = true;
      }
    }

    if (updated) {
      this.logger.log(`Saving cart with updated item validity`);
      await this.cartItemRepo.save(cart.items);
    }

    return cart;
  }
  /*
   * Adds a variant to the user's cart.
   * If already exists, it updates the quantity.
   * Uses stock from related warehouse entries.
   */
  async addItemToCart(
    user: UserFromToken,
    dto: CreateCartItemDto,
  ): Promise<Cart> {
    const variant = await this.variantRepo.findOne({
      where: { id: dto.variant_id },
      relations: ['stocks'], // Must load related stock entries
    });

    if (!variant) {
      this.logger.warn(`Variant ID ${dto.variant_id} not found`);
      throw new NotFoundException('Product variant not found');
    }

    const totalStock =
      variant.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;

    if (totalStock < dto.quantity) {
      this.logger.warn(
        `Variant ID ${dto.variant_id} has only ${totalStock} in stock`,
      );
      throw new BadRequestException('Not enough stock for this product');
    }

    const cart = await this.getOrCreateCart(user);
    const existingItem = cart.items.find(
      (item) => item.variant.id === dto.variant_id,
    );

    if (existingItem) {
      this.logger.log(`Updating quantity for variant ID ${dto.variant_id}`);
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      this.logger.log(`Adding new item to cart: variant ID ${dto.variant_id}`);
      const newItem = this.cartItemRepo.create({
        cart,
        variant,
        quantity: dto.quantity,
        price_at_add: variant.price,
        price_discounted: dto.price_discounted,
        selected_attributes: dto.selected_attributes,
        expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
        added_from_campaign: dto.added_from_campaign,
        valid: true,
      });
      await this.cartItemRepo.save(newItem);
    }

    return this.getOrCreateCart(user);
  }

  /**
   * Removes all items from the current user's cart.
   */
  async clearCart(user: UserFromToken): Promise<void> {
    const cart = await this.getOrCreateCart(user);
    this.logger.log(`Clearing all items for user ID ${user.id}`);
    await this.cartItemRepo.delete({ cart: { id: cart.id } });
  }

  /**
   * Removes a specific item by variant ID from the user's cart.
   */
  async removeItem(user: UserFromToken, variantId: number): Promise<void> {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items.find((i) => i.variant.id === variantId);

    if (!item) {
      this.logger.warn(`Item with variant ID ${variantId} not found in cart`);
      throw new NotFoundException('Item not found in cart');
    }

    this.logger.log(`Removing item (variant ID ${variantId}) from cart`);
    await this.cartItemRepo.remove(item);
  }
}
