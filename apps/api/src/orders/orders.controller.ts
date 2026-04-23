import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(
    @Query('level') level?: string,
    @Query('clientOrderId', new ParseIntPipe({ optional: true })) clientOrderId?: number,
    @Query('parentId', new ParseIntPipe({ optional: true })) parentId?: number
  ): Promise<Order[]> {
    if (level) {
      return this.ordersService.getOrdersByLevel(level);
    }
    if (clientOrderId) {
      return this.ordersService.getAlgoOrdersForClient(clientOrderId);
    }
    if (parentId) {
      return this.ordersService.getMarketOrdersForAlgo(parentId);
    }
    return this.ordersService.getAllOrders();
  }

  @Get('stats')
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.ordersService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    const order = await this.ordersService.updateOrder(id, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
