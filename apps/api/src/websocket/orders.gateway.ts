import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/entities/order.entity';

interface WebSocketMessage {
  type: 'snapshot' | 'orderCreate' | 'orderUpdate' | 'orderDelete';
  data: Order | Order[] | { orderId: number };
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class OrdersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(OrdersGateway.name);
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(private readonly ordersService: OrdersService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
    // Start simulation after 2 seconds
    setTimeout(() => {
      this.startSimulation(2000);
    }, 2000);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const orders = await this.ordersService.getAllOrders();
      const message: WebSocketMessage = {
        type: 'snapshot',
        data: orders,
        timestamp: new Date().toISOString(),
      };
      client.emit('message', message);
    } catch (error) {
      this.logger.error('Error sending snapshot', error);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcast(message: WebSocketMessage): void {
    this.server.emit('message', message);
  }

  startSimulation(intervalMs: number = 2000): void {
    if (this.updateInterval) {
      this.logger.warn('Simulation already running');
      return;
    }

    this.logger.log(`Starting order update simulation (interval: ${intervalMs}ms)`);

    this.updateInterval = setInterval(async () => {
      try {
        const updatedOrder = await this.ordersService.simulateOrderUpdate();
        if (updatedOrder) {
          const message: WebSocketMessage = {
            type: 'orderUpdate',
            data: updatedOrder,
            timestamp: new Date().toISOString(),
          };
          this.broadcast(message);
        }
      } catch (error) {
        this.logger.error('Error during simulation', error);
      }
    }, intervalMs);
  }

  stopSimulation(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      this.logger.log('Simulation stopped');
    }
  }
}
