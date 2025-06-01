
# 📦 SouqSyria Backend – Cart Module Summary

## 📘 Module Purpose

The **Cart Module** handles user shopping carts in the SouqSyria e-commerce platform. Each user has one active cart containing items (product variants) they intend to purchase. This module supports adding, removing, clearing, and validating items in the cart.

It integrates deeply with:
- ✅ Product Variants (multi-warehouse stock)
- ✅ Firebase or JWT-authenticated users
- ✅ Dynamic ACL system using `PermissionsGuard`
- ✅ Redis-ready logic (future support for cache/memory carts)

## 📂 Folder Structure

```
src/cart/
├── cart.module.ts            # Registers TypeORM entities and service/controller
├── cart.controller.ts        # REST endpoints with Swagger + PermissionsGuard
├── cart.service.ts           # Business logic and validation
├── dto/
│   └── create-cart-item.dto.ts
├── entities/
│   ├── cart.entity.ts
│   └── cart-item.entity.ts
```

## 🧱 Entities

### `Cart`
Represents one cart per user.
```ts
@ManyToOne(() => User)
user: User;

@OneToMany(() => CartItem)
items: CartItem[];
```

### `CartItem`
Each row represents one product variant added to the cart.

Includes:
- `price_at_add`
- `price_discounted`
- `selected_attributes`
- `expires_at`
- `added_from_campaign`
- `valid` (auto-managed)

## 🧾 DTO

### `CreateCartItemDto`
Validated with `class-validator`, includes:
- `variant_id: number`
- `quantity: number`
- Optional: `price_discounted`, `expires_at`, `added_from_campaign`, `selected_attributes`

## ⚙️ Service – `CartService`

Methods:
- `getOrCreateCart(user: UserFromToken)`  
  Retrieves existing cart or creates a new one. Also runs validation on all items.
- `addItemToCart(user, dto)`  
  Validates product/stock and adds new item or updates quantity.
- `clearCart(user)`  
  Removes all items from the user's cart.
- `removeItem(user, variantId)`  
  Removes a single item by variant ID.

### 🔒 Logic Highlights:
- Auto-invalidates cart items if:
  - Variant is inactive
  - Price has changed
  - Stock is zero
- Logs all changes using `Logger`

## 🧭 Controller – `CartController`

### Routes (Swagger-ready)

| Method | Path              | Description             |
|--------|-------------------|-------------------------|
| GET    | `/cart`           | Get current user's cart |
| POST   | `/cart/add`       | Add item to cart        |
| DELETE | `/cart/item/:id`  | Remove one item         |
| DELETE | `/cart/clear`     | Clear entire cart       |

### Features:
- Uses `@CurrentUser()` for type-safe user access
- Secured with `@UseGuards(PermissionsGuard)`
- Fully documented with `@ApiTags`, `@ApiOperation`

## ✅ Highlights

- Uses `UserFromToken` model across service and controller
- No DB fetch required for most actions (perf-optimized)
- Safe stock validation with sum of `ProductStockEntity[]`
- Future-ready: Cart expiry, campaign attribution, Redis sync
- Clean error handling (NotFound, BadRequest)
- Modular and extensible

## 📈 Future Enhancements (optional)

- Redis cart session cache
- Delayed cart cleanup using BullJS or Cron
- Cart sharing (B2B/wholesale use case)
- UI-level `valid = false` badge display
