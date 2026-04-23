-- Seed data for testing the Trading Blotter
-- This creates a realistic set of orders with the three-tier hierarchy

-- Clear existing data
TRUNCATE TABLE client_orders, algo_orders, market_orders RESTART IDENTITY CASCADE;

-- Insert Client Orders (10 client orders)
INSERT INTO client_orders (
    level, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, available_quantity, done_percent, price, average_price, currency, order_value, done_value
) VALUES
    ('Client', 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 10000, 6500, 3500, 65.00, 175.50, 175.25, 'USD', 1755000.00, 1139125.00),
    ('Client', 'Morgan Stanley', 'MSFT', 'MSFT.O', 'NASDAQ', 'Equity', 'Sarah Johnson', 'Morgan Stanley', 'MS001', 'ACC-002', 'Sell', 'Market', 'Day', 'Filled', 5000, 5000, 0, 100.00, 380.00, 379.85, 'USD', 1900000.00, 1899250.00),
    ('Client', 'JP Morgan', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 8000, 0, 8000, 0.00, 142.30, 0, 'USD', 1138400.00, 0),
    ('Client', 'Citadel', 'TSLA', 'TSLA.O', 'NASDAQ', 'Equity', 'Emily Davis', 'Citadel', 'CIT001', 'ACC-004', 'Short Sell', 'Limit', 'Day', 'Partial', 3000, 1200, 1800, 40.00, 245.75, 246.10, 'USD', 737250.00, 295320.00),
    ('Client', 'BlackRock', 'AMZN', 'AMZN.O', 'NASDAQ', 'Equity', 'John Smith', 'BlackRock', 'BR001', 'ACC-005', 'Buy', 'Market', 'IOC', 'Filled', 2500, 2500, 0, 100.00, 178.90, 178.95, 'USD', 447250.00, 447375.00),
    ('Client', 'Vanguard', 'META', 'META.O', 'NASDAQ', 'Equity', 'Lisa Wang', 'Vanguard', 'VG001', 'ACC-006', 'Sell', 'Limit', 'GTC', 'New', 6000, 0, 6000, 0.00, 485.20, 0, 'USD', 2911200.00, 0),
    ('Client', 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 15000, 9000, 6000, 60.00, 875.50, 874.80, 'USD', 13132500.00, 7873200.00),
    ('Client', 'State Street', 'JPM', 'JPM.N', 'NYSE', 'Equity', 'Sarah Johnson', 'State Street', 'SS001', 'ACC-008', 'Buy', 'Market', 'Day', 'Filled', 4000, 4000, 0, 100.00, 185.30, 185.35, 'USD', 741200.00, 741400.00),
    ('Client', 'Goldman Sachs', 'BAC', 'BAC.N', 'NYSE', 'Equity', 'Mike Chen', 'Goldman Sachs', 'GS002', 'ACC-009', 'Sell', 'Limit', 'Day', 'Rejected', 7000, 0, 7000, 0.00, 38.75, 0, 'USD', 271250.00, 0),
    ('Client', 'Morgan Stanley', 'XOM', 'XOM.N', 'NYSE', 'Equity', 'Emily Davis', 'Morgan Stanley', 'MS002', 'ACC-010', 'Buy', 'Limit', 'GTC', 'Partial', 5500, 2200, 3300, 40.00, 112.40, 112.35, 'USD', 618200.00, 247170.00);

-- Insert Algo Orders (2-3 per client order)
-- For Client Order 1 (AAPL)
INSERT INTO algo_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, available_quantity, done_percent, price, average_price, currency, order_value, done_value
) VALUES
    ('Algo', 1, 'Goldman Sachs', 'VWAP', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 6000, 4000, 2000, 66.67, 175.50, 175.30, 'USD', 1053000.00, 701200.00),
    ('Algo', 1, 'Goldman Sachs', 'Iceberg', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 4000, 2500, 1500, 62.50, 175.50, 175.20, 'USD', 702000.00, 438000.00);

-- For Client Order 2 (MSFT)
INSERT INTO algo_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 2, 2, 'TWAP', 'MSFT', 'MSFT.O', 'NASDAQ', 'Equity', 'Sarah Johnson', 'Morgan Stanley', 'MS001', 'ACC-002', 'Sell', 'Market', 'Day', 'Filled', 5000, 5000, 380.00, 379.85, 'USD');

-- For Client Order 3 (GOOGL)
INSERT INTO algo_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 3, 3, 'VWAP', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 5000, 0, 142.30, 0, 'USD'),
    ('Algo', 3, 3, 'POV', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 3000, 0, 142.30, 0, 'USD');

-- For Client Order 4 (TSLA)
INSERT INTO algo_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 4, 4, 'Iceberg', 'TSLA', 'TSLA.O', 'NASDAQ', 'Equity', 'Emily Davis', 'Citadel', 'CIT001', 'ACC-004', 'Short Sell', 'Limit', 'Day', 'Partial', 2000, 800, 245.75, 246.05, 'USD'),
    ('Algo', 4, 4, 'VWAP', 'TSLA', 'TSLA.O', 'NASDAQ', 'Equity', 'Emily Davis', 'Citadel', 'CIT001', 'ACC-004', 'Short Sell', 'Limit', 'Day', 'Partial', 1000, 400, 245.75, 246.15, 'USD');

-- For Client Order 7 (NVDA)
INSERT INTO algo_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 7, 7, 'TWAP', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 8000, 5000, 875.50, 874.90, 'USD'),
    ('Algo', 7, 7, 'POV', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 7000, 4000, 875.50, 874.70, 'USD');

-- Generate Market Orders for Algo Order 11 (AAPL VWAP)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 175.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..100 LOOP
        qty := 40 + (random() * 60)::INTEGER;
        done_qty := CASE WHEN random() > 0.3 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 11, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001',
            'Buy', 'Limit', 'GTC', 
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty, 
            base_price + (random() * 2 - 1), 
            CASE WHEN done_qty > 0 THEN base_price + (random() * 2 - 1) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '2 hours')
        );
    END LOOP;
END $$;

-- Generate Market Orders for Algo Order 12 (AAPL Iceberg)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 175.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..80 LOOP
        qty := 30 + (random() * 50)::INTEGER;
        done_qty := CASE WHEN random() > 0.4 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 12, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001',
            'Buy', 'Limit', 'GTC',
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty,
            base_price + (random() * 2 - 1),
            CASE WHEN done_qty > 0 THEN base_price + (random() * 2 - 1) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '2 hours')
        );
    END LOOP;
END $$;

-- Generate Market Orders for Algo Order 17 (NVDA TWAP)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 875.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..150 LOOP
        qty := 25 + (random() * 75)::INTEGER;
        done_qty := CASE WHEN random() > 0.2 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 17, 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007',
            'Buy', 'Limit', 'GTC',
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty,
            base_price + (random() * 10 - 5),
            CASE WHEN done_qty > 0 THEN base_price + (random() * 10 - 5) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '3 hours')
        );
    END LOOP;
END $$;

-- Insert Algo Orders (2-3 per client order)
-- For Client Order 1 (AAPL)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 1, 1, 'VWAP', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 6000, 4000, 175.50, 175.30, 'USD'),
    ('Algo', 1, 1, 'Iceberg', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 4000, 2500, 175.50, 175.20, 'USD');

-- For Client Order 2 (MSFT)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 2, 2, 'TWAP', 'MSFT', 'MSFT.O', 'NASDAQ', 'Equity', 'Sarah Johnson', 'Morgan Stanley', 'MS001', 'ACC-002', 'Sell', 'Market', 'Day', 'Filled', 5000, 5000, 380.00, 379.85, 'USD');

-- For Client Order 3 (GOOGL)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 3, 3, 'VWAP', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 5000, 0, 142.30, 0, 'USD'),
    ('Algo', 3, 3, 'POV', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 3000, 0, 142.30, 0, 'USD');

-- For Client Order 4 (TSLA)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 4, 4, 'Iceberg', 'TSLA', 'TSLA.O', 'NASDAQ', 'Equity', 'Emily Davis', 'Citadel', 'CIT001', 'ACC-004', 'Short Sell', 'Limit', 'Day', 'Partial', 3000, 1200, 245.75, 246.10, 'USD');

-- For Client Order 7 (NVDA)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 7, 7, 'VWAP', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 10000, 6000, 875.50, 874.90, 'USD'),
    ('Algo', 7, 7, 'TWAP', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 5000, 3000, 875.50, 874.70, 'USD');

-- For Client Order 10 (XOM)
INSERT INTO market_orders (
    level, client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, price, average_price, currency
) VALUES
    ('Algo', 10, 10, 'VWAP', 'XOM', 'XOM.N', 'NYSE', 'Equity', 'Emily Davis', 'Morgan Stanley', 'MS002', 'ACC-010', 'Buy', 'Limit', 'GTC', 'Partial', 5500, 2200, 112.40, 112.35, 'USD');

-- Insert Market Orders (50-200 per algo order for realistic volume)
-- This is a sample - in production, you'd generate many more

-- Market orders for Algo Order 11 (AAPL VWAP)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 175.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..100 LOOP
        qty := 40 + (random() * 60)::INTEGER;
        done_qty := CASE WHEN random() > 0.3 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 11, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001',
            'Buy', 'Limit', 'GTC', 
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty, 
            base_price + (random() * 2 - 1), 
            CASE WHEN done_qty > 0 THEN base_price + (random() * 2 - 1) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '2 hours')
        );
    END LOOP;
END $$;

-- Market orders for Algo Order 12 (AAPL Iceberg)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 175.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..80 LOOP
        qty := 30 + (random() * 50)::INTEGER;
        done_qty := CASE WHEN random() > 0.4 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 12, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001',
            'Buy', 'Limit', 'GTC',
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty,
            base_price + (random() * 2 - 1),
            CASE WHEN done_qty > 0 THEN base_price + (random() * 2 - 1) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '2 hours')
        );
    END LOOP;
END $$;

-- Market orders for Algo Order 17 (NVDA VWAP)
DO $$
DECLARE
    i INTEGER;
    base_price DECIMAL := 875.50;
    qty INTEGER;
    done_qty INTEGER;
BEGIN
    FOR i IN 1..150 LOOP
        qty := 50 + (random() * 100)::INTEGER;
        done_qty := CASE WHEN random() > 0.3 THEN qty ELSE (qty * random())::INTEGER END;
        
        INSERT INTO market_orders (
            level, parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
            side, type, tif, state, quantity, done_quantity, price, average_price, currency,
            sent_time
        ) VALUES (
            'Market', 17, 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007',
            'Buy', 'Limit', 'GTC',
            CASE 
                WHEN done_qty = qty THEN 'Filled'
                WHEN done_qty > 0 THEN 'Partial'
                ELSE 'Pending'
            END,
            qty, done_qty,
            base_price + (random() * 10 - 5),
            CASE WHEN done_qty > 0 THEN base_price + (random() * 10 - 5) ELSE 0 END,
            'USD',
            CURRENT_TIMESTAMP - (random() * interval '3 hours')
        );
    END LOOP;
END $$;