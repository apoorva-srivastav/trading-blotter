import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Order, OrderStats } from '../orders/entities/order.entity';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      database: this.configService.get('DB_NAME', 'trading_blotter'),
      user: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASSWORD'),
      min: this.configService.get('DB_POOL_MIN', 2),
      max: this.configService.get('DB_POOL_MAX', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected database pool error', err);
    });
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      this.logger.log('Database connection established successfully');
      client.release();
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection pool closed');
  }

  async getAllOrders(): Promise<Order[]> {
    const query = `
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        NULL::INTEGER as client_order_id, NULL::INTEGER as parent_id, NULL::VARCHAR(50) as algo_type
      FROM client_orders
      UNION ALL
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        client_order_id, NULL::INTEGER as parent_id, algo_type
      FROM algo_orders
      UNION ALL
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        NULL::INTEGER as client_order_id, parent_id, NULL::VARCHAR(50) as algo_type
      FROM market_orders
      ORDER BY created DESC
    `;
    const result = await this.pool.query(query);
    return result.rows.map(this.mapRowToOrder);
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    const query = `
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        NULL::INTEGER as client_order_id, NULL::INTEGER as parent_id, NULL::VARCHAR(50) as algo_type
      FROM client_orders WHERE order_id = $1
      UNION ALL
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        client_order_id, NULL::INTEGER as parent_id, algo_type
      FROM algo_orders WHERE order_id = $1
      UNION ALL
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        NULL::INTEGER as client_order_id, parent_id, NULL::VARCHAR(50) as algo_type
      FROM market_orders WHERE order_id = $1
    `;
    const result = await this.pool.query(query, [orderId]);
    return result.rows.length > 0 ? this.mapRowToOrder(result.rows[0]) : null;
  }

  async getOrdersByLevel(level: string): Promise<Order[]> {
    let query: string;
    switch (level.toLowerCase()) {
      case 'client':
        query = `
          SELECT 
            order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
            price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
            NULL::INTEGER as client_order_id, NULL::INTEGER as parent_id, NULL::VARCHAR(50) as algo_type
          FROM client_orders ORDER BY created DESC
        `;
        break;
      case 'algo':
        query = `
          SELECT 
            order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
            price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
            client_order_id, NULL::INTEGER as parent_id, algo_type
          FROM algo_orders ORDER BY created DESC
        `;
        break;
      case 'market':
        query = `
          SELECT 
            order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
            price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
            NULL::INTEGER as client_order_id, parent_id, NULL::VARCHAR(50) as algo_type
          FROM market_orders ORDER BY created DESC
        `;
        break;
      default:
        return [];
    }

    const result = await this.pool.query(query);
    return result.rows.map(this.mapRowToOrder);
  }

  async getAlgoOrdersForClient(clientOrderId: number): Promise<Order[]> {
    const query = `
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        client_order_id, NULL::INTEGER as parent_id, algo_type
      FROM algo_orders 
      WHERE client_order_id = $1 
      ORDER BY order_id
    `;
    const result = await this.pool.query(query, [clientOrderId]);
    return result.rows.map(this.mapRowToOrder);
  }

  async getMarketOrdersForAlgo(algoOrderId: number): Promise<Order[]> {
    const query = `
      SELECT 
        order_id, level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
        side, type, tif, state, quantity, done_quantity, available_quantity, done_percent,
        price, average_price, currency, order_value, done_value, created, updated, sent_time, reject_reason,
        NULL::INTEGER as client_order_id, parent_id, NULL::VARCHAR(50) as algo_type
      FROM market_orders 
      WHERE parent_id = $1 
      ORDER BY order_id
    `;
    const result = await this.pool.query(query, [algoOrderId]);
    return result.rows.map(this.mapRowToOrder);
  }

  async getOrderStats(): Promise<OrderStats> {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM client_orders) as client_orders,
        (SELECT COUNT(*) FROM algo_orders) as algo_orders,
        (SELECT COUNT(*) FROM market_orders) as market_orders,
        (SELECT COALESCE(SUM(order_value), 0) FROM client_orders) +
        (SELECT COALESCE(SUM(order_value), 0) FROM algo_orders) +
        (SELECT COALESCE(SUM(order_value), 0) FROM market_orders) as total_value,
        (SELECT COALESCE(SUM(done_value), 0) FROM client_orders) +
        (SELECT COALESCE(SUM(done_value), 0) FROM algo_orders) +
        (SELECT COALESCE(SUM(done_value), 0) FROM market_orders) as total_done_value
    `;
    const result = await this.pool.query(query);
    const row = result.rows[0];

    return {
      totalOrders: Number(row.client_orders) + Number(row.algo_orders) + Number(row.market_orders),
      clientOrders: Number(row.client_orders),
      algoOrders: Number(row.algo_orders),
      marketOrders: Number(row.market_orders),
      totalValue: Number(row.total_value),
      totalDoneValue: Number(row.total_done_value),
    };
  }

  async updateOrder(orderId: number, updates: Partial<Order>): Promise<Order | null> {
    const order = await this.getOrderById(orderId);
    if (!order) return null;

    let tableName: string;
    switch (order.level) {
      case 'Client':
        tableName = 'client_orders';
        break;
      case 'Algo':
        tableName = 'algo_orders';
        break;
      case 'Market':
        tableName = 'market_orders';
        break;
      default:
        return null;
    }

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const snakeKey = this.camelToSnake(key);
      setClauses.push(`${snakeKey} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    });

    setClauses.push(`updated = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    values.push(orderId);

    const query = `
      UPDATE ${tableName}
      SET ${setClauses.join(', ')}
      WHERE order_id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows.length > 0 ? this.mapRowToOrder(result.rows[0]) : null;
  }

  private mapRowToOrder = (row: any): Order => {
    return {
      orderId: row.order_id,
      level: row.level,
      clientOrderId: row.client_order_id || undefined,
      parentId: row.parent_id || undefined,
      client: row.client,
      side: row.side,
      symbol: row.symbol,
      ric: row.ric,
      exchange: row.exchange,
      product: row.product,
      trader: row.trader,
      clientName: row.client_name,
      clientCode: row.client_code,
      account: row.account,
      type: row.type,
      tif: row.tif,
      state: row.state,
      quantity: Number(row.quantity),
      doneQuantity: Number(row.done_quantity),
      availableQuantity: Number(row.available_quantity),
      donePercent: Number(row.done_percent),
      orderValue: Number(row.order_value),
      doneValue: Number(row.done_value),
      price: Number(row.price),
      averagePrice: row.average_price ? Number(row.average_price) : undefined,
      currency: row.currency,
      created: row.created,
      updated: row.updated,
      sentTime: row.sent_time,
      rejectReason: row.reject_reason,
      algoType: row.algo_type || undefined,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
