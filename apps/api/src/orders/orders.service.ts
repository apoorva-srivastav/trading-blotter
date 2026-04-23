import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Order, OrderStats } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async getAllOrders(): Promise<Order[]> {
    this.logger.debug('Fetching all orders');
    return this.databaseService.getAllOrders();
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    this.logger.debug(`Fetching order with ID: ${orderId}`);
    return this.databaseService.getOrderById(orderId);
  }

  async getOrdersByLevel(level: string): Promise<Order[]> {
    this.logger.debug(`Fetching orders by level: ${level}`);
    return this.databaseService.getOrdersByLevel(level);
  }

  async getAlgoOrdersForClient(clientOrderId: number): Promise<Order[]> {
    this.logger.debug(`Fetching algo orders for client: ${clientOrderId}`);
    return this.databaseService.getAlgoOrdersForClient(clientOrderId);
  }

  async getMarketOrdersForAlgo(algoOrderId: number): Promise<Order[]> {
    this.logger.debug(`Fetching market orders for algo: ${algoOrderId}`);
    return this.databaseService.getMarketOrdersForAlgo(algoOrderId);
  }

  async getOrderStats(): Promise<OrderStats> {
    this.logger.debug('Fetching order statistics');
    return this.databaseService.getOrderStats();
  }

  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    this.logger.debug(`Updating order ${orderId}`);
    return this.databaseService.updateOrder(orderId, updateOrderDto);
  }

  async simulateOrderUpdate(): Promise<Order | null> {
    const orders = await this.getAllOrders();
    if (orders.length === 0) return null;

    const randomOrder = orders[Math.floor(Math.random() * orders.length)];

    if (randomOrder.state === 'Pending' || randomOrder.state === 'Partial') {
      const remainingQty = randomOrder.quantity - randomOrder.doneQuantity;
      const fillQty = Math.min(remainingQty, Math.floor(Math.random() * (remainingQty / 2)) + 1);
      const newDoneQty = randomOrder.doneQuantity + fillQty;

      const updates: UpdateOrderDto = {
        doneQuantity: newDoneQty,
        state: newDoneQty >= randomOrder.quantity ? 'Filled' : 'Partial',
      };

      return this.updateOrder(randomOrder.orderId, updates);
    }

    return null;
  }
}
