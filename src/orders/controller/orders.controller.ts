import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { RequestReturnDto } from '../dto/request-return.dto';
import { FilterOrdersDto } from '../dto/filter-orders.dto';
import { RefundRequestDto } from 'src/refund/dto/refund-request.dto';

import { PermissionsGuard } from 'src/access-control/guards/permissions.guard';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(FirebaseAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * ✅ Buyer places a new order.
   */
  @Post()
  @ApiOperation({ summary: 'Create new order (Buyer)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user, dto);
  }

  /**
   * 🔁 Buyer or admin updates order status.
   */
  @Put('status')
  @ApiOperation({ summary: 'Update order status (Vendor/Admin)' })
  async updateOrderStatus(@Req() req, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(req.user, dto);
  }

  /**
   * ♻️ Buyer requests a return for their order.
   */
  @Post('return')
  @ApiOperation({ summary: 'Request product return (Buyer)' })
  async requestReturn(@Req() req, @Body() dto: RequestReturnDto) {
    return this.ordersService.requestReturn(req.user, dto);
  }

  /**
   * 💵 Admin processes a refund request.
   */
  @Post('refund')
  @ApiOperation({ summary: 'Initiate refund (Admin/Finance)' })
  async requestRefund(@Req() req, @Body() dto: RefundRequestDto) {
    return this.ordersService.requestRefund(req.user, dto);
  }

  /**
   * 📄 Buyer fetches all their own orders.
   */
  @Get('my')
  @ApiOperation({ summary: 'Get my orders (Buyer)' })
  async getMyOrders(@Req() req) {
    return this.ordersService.getMyOrders(req.user);
  }

  /**
   * 📦 Vendor fetches orders linked to their products.
   */
  @Get('vendor')
  @ApiOperation({ summary: 'Get vendor orders (Vendor)' })
  async getVendorOrders(@Req() req) {
    return this.ordersService.getVendorOrders(req.user.vendor_id);
  }

  /**
   * 📊 Admin fetches filtered order list.
   */
  @Get()
  @ApiOperation({ summary: 'List all orders with filters (Admin)' })
  async getAllOrders(@Query() filters: FilterOrdersDto) {
    return this.ordersService.getAllOrders(filters);
  }

  /**
   * 🧾 Get full order details by order ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get full order details by ID' })
  async getOrderDetails(@Param('id') orderId: number) {
    return this.ordersService.getOrderDetails(orderId);
  }
}
