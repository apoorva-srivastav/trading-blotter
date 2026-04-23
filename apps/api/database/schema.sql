-- Trading Blotter Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS market_orders CASCADE;
DROP TABLE IF EXISTS algo_orders CASCADE;
DROP TABLE IF EXISTS client_orders CASCADE;

-- Client Orders Table
CREATE TABLE client_orders (
    order_id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL DEFAULT 'Client',
    client VARCHAR(200) NOT NULL,
    
    -- Trading details
    symbol VARCHAR(20) NOT NULL,
    ric VARCHAR(50),
    exchange VARCHAR(20) NOT NULL,
    product VARCHAR(50),
    
    -- Client/Account info
    trader VARCHAR(100) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_code VARCHAR(50) NOT NULL,
    account VARCHAR(100) NOT NULL,
    
    -- Order specifics
    side VARCHAR(15) NOT NULL CHECK (side IN ('Buy', 'Sell', 'Short Sell')),
    type VARCHAR(15) NOT NULL CHECK (type IN ('Market', 'Limit', 'Stop', 'Stop Limit')),
    tif VARCHAR(10) NOT NULL CHECK (tif IN ('Day', 'GTC', 'IOC', 'FOK')),
    state VARCHAR(15) NOT NULL CHECK (state IN ('Pending', 'Partial', 'Filled', 'Cancelled', 'Rejected')),
    
    -- Quantities
    quantity DECIMAL(18, 4) NOT NULL,
    done_quantity DECIMAL(18, 4) DEFAULT 0,
    available_quantity DECIMAL(18, 4) NOT NULL,
    done_percent DECIMAL(5, 2) DEFAULT 0,
    
    -- Pricing
    price DECIMAL(18, 4) NOT NULL,
    average_price DECIMAL(18, 4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    order_value DECIMAL(18, 2) NOT NULL,
    done_value DECIMAL(18, 2) DEFAULT 0,
    
    -- Timestamps
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Error handling
    reject_reason TEXT
);

-- Algo Orders Table
CREATE TABLE algo_orders (
    order_id SERIAL PRIMARY KEY,
    client_order_id INTEGER NOT NULL REFERENCES client_orders(order_id) ON DELETE CASCADE,
    level VARCHAR(10) NOT NULL DEFAULT 'Algo',
    client VARCHAR(200) NOT NULL,
    algo_type VARCHAR(50) NOT NULL,
    
    -- Trading details
    symbol VARCHAR(20) NOT NULL,
    ric VARCHAR(50),
    exchange VARCHAR(20) NOT NULL,
    product VARCHAR(50),
    
    -- Client/Account info
    trader VARCHAR(100) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_code VARCHAR(50) NOT NULL,
    account VARCHAR(100) NOT NULL,
    
    -- Order specifics
    side VARCHAR(15) NOT NULL CHECK (side IN ('Buy', 'Sell', 'Short Sell')),
    type VARCHAR(15) NOT NULL CHECK (type IN ('Market', 'Limit', 'Stop', 'Stop Limit')),
    tif VARCHAR(10) NOT NULL CHECK (tif IN ('Day', 'GTC', 'IOC', 'FOK')),
    state VARCHAR(15) NOT NULL CHECK (state IN ('Pending', 'Partial', 'Filled', 'Cancelled', 'Rejected')),
    
    -- Quantities
    quantity DECIMAL(18, 4) NOT NULL,
    done_quantity DECIMAL(18, 4) DEFAULT 0,
    available_quantity DECIMAL(18, 4) NOT NULL,
    done_percent DECIMAL(5, 2) DEFAULT 0,
    
    -- Pricing
    price DECIMAL(18, 4) NOT NULL,
    average_price DECIMAL(18, 4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    order_value DECIMAL(18, 2) NOT NULL,
    done_value DECIMAL(18, 2) DEFAULT 0,
    
    -- Timestamps
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Error handling
    reject_reason TEXT
);

-- Market Orders Table
CREATE TABLE market_orders (
    order_id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL REFERENCES algo_orders(order_id) ON DELETE CASCADE,
    level VARCHAR(10) NOT NULL DEFAULT 'Market',
    client VARCHAR(200) NOT NULL,
    
    -- Trading details
    symbol VARCHAR(20) NOT NULL,
    ric VARCHAR(50),
    exchange VARCHAR(20) NOT NULL,
    product VARCHAR(50),
    
    -- Client/Account info
    trader VARCHAR(100) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_code VARCHAR(50) NOT NULL,
    account VARCHAR(100) NOT NULL,
    
    -- Order specifics
    side VARCHAR(15) NOT NULL CHECK (side IN ('Buy', 'Sell', 'Short Sell')),
    type VARCHAR(15) NOT NULL CHECK (type IN ('Market', 'Limit', 'Stop', 'Stop Limit')),
    tif VARCHAR(10) NOT NULL CHECK (tif IN ('Day', 'GTC', 'IOC', 'FOK')),
    state VARCHAR(15) NOT NULL CHECK (state IN ('Pending', 'Partial', 'Filled', 'Cancelled', 'Rejected')),
    
    -- Quantities
    quantity DECIMAL(18, 4) NOT NULL,
    done_quantity DECIMAL(18, 4) DEFAULT 0,
    available_quantity DECIMAL(18, 4) NOT NULL,
    done_percent DECIMAL(5, 2) DEFAULT 0,
    
    -- Pricing
    price DECIMAL(18, 4) NOT NULL,
    average_price DECIMAL(18, 4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    order_value DECIMAL(18, 2) NOT NULL,
    done_value DECIMAL(18, 2) DEFAULT 0,
    
    -- Timestamps
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Error handling
    reject_reason TEXT
);

-- Indexes for query optimization
CREATE INDEX idx_client_orders_symbol ON client_orders(symbol);
CREATE INDEX idx_client_orders_state ON client_orders(state);
CREATE INDEX idx_client_orders_created ON client_orders(created DESC);

CREATE INDEX idx_algo_orders_client_order_id ON algo_orders(client_order_id);
CREATE INDEX idx_algo_orders_symbol ON algo_orders(symbol);
CREATE INDEX idx_algo_orders_state ON algo_orders(state);
CREATE INDEX idx_algo_orders_created ON algo_orders(created DESC);

CREATE INDEX idx_market_orders_parent_id ON market_orders(parent_id);
CREATE INDEX idx_market_orders_symbol ON market_orders(symbol);
CREATE INDEX idx_market_orders_state ON market_orders(state);
CREATE INDEX idx_market_orders_created ON market_orders(created DESC);

-- Triggers to update 'updated' timestamp
CREATE OR REPLACE FUNCTION update_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_orders_updated
BEFORE UPDATE ON client_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_column();

CREATE TRIGGER update_algo_orders_updated
BEFORE UPDATE ON algo_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_column();

CREATE TRIGGER update_market_orders_updated
BEFORE UPDATE ON market_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_column();

-- Triggers to calculate order metrics
CREATE OR REPLACE FUNCTION calculate_order_metrics()
RETURNS TRIGGER AS $$
BEGIN
    NEW.done_percent = CASE 
        WHEN NEW.quantity > 0 THEN (NEW.done_quantity / NEW.quantity) * 100
        ELSE 0
    END;
    
    NEW.available_quantity = NEW.quantity - NEW.done_quantity;
    NEW.order_value = NEW.quantity * NEW.price;
    
    NEW.done_value = CASE
        WHEN NEW.average_price > 0 THEN NEW.done_quantity * NEW.average_price
        ELSE NEW.done_quantity * NEW.price
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_client_order_metrics
BEFORE INSERT OR UPDATE ON client_orders
FOR EACH ROW
EXECUTE FUNCTION calculate_order_metrics();

CREATE TRIGGER calculate_algo_order_metrics
BEFORE INSERT OR UPDATE ON algo_orders
FOR EACH ROW
EXECUTE FUNCTION calculate_order_metrics();

CREATE TRIGGER calculate_market_order_metrics
BEFORE INSERT OR UPDATE ON market_orders
FOR EACH ROW
EXECUTE FUNCTION calculate_order_metrics();
