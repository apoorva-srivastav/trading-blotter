-- Simple seed data for testing the Trading Blotter
-- This creates a basic set of orders with the three-tier hierarchy

-- Clear existing data
TRUNCATE TABLE client_orders, algo_orders, market_orders RESTART IDENTITY CASCADE;

-- Insert Client Orders (5 client orders)
INSERT INTO client_orders (
    client, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, available_quantity, done_percent, 
    price, average_price, currency, order_value, done_value
) VALUES
    ('Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 10000, 6500, 3500, 65.00, 175.50, 175.25, 'USD', 1755000.00, 1139125.00),
    ('Morgan Stanley', 'MSFT', 'MSFT.O', 'NASDAQ', 'Equity', 'Sarah Johnson', 'Morgan Stanley', 'MS001', 'ACC-002', 'Sell', 'Market', 'Day', 'Filled', 5000, 5000, 0, 100.00, 380.00, 379.85, 'USD', 1900000.00, 1899250.00),
    ('JP Morgan', 'GOOGL', 'GOOGL.O', 'NASDAQ', 'Equity', 'Mike Chen', 'JP Morgan', 'JPM001', 'ACC-003', 'Buy', 'Limit', 'GTC', 'Pending', 8000, 0, 8000, 0.00, 142.30, 0, 'USD', 1138400.00, 0),
    ('Citadel', 'TSLA', 'TSLA.O', 'NASDAQ', 'Equity', 'Emily Davis', 'Citadel', 'CIT001', 'ACC-004', 'Sell', 'Limit', 'Day', 'Partial', 3000, 1200, 1800, 40.00, 245.75, 246.10, 'USD', 737250.00, 295320.00),
    ('Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 15000, 9000, 6000, 60.00, 875.50, 874.80, 'USD', 13132500.00, 7873200.00);

-- Insert Algo Orders
INSERT INTO algo_orders (
    client_order_id, client, algo_type, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, available_quantity, done_percent, 
    price, average_price, currency, order_value, done_value
) VALUES
    (1, 'Goldman Sachs', 'VWAP', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 6000, 4000, 2000, 66.67, 175.50, 175.30, 'USD', 1053000.00, 701200.00),
    (1, 'Goldman Sachs', 'Iceberg', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 4000, 2500, 1500, 62.50, 175.50, 175.20, 'USD', 702000.00, 438000.00),
    (2, 'Morgan Stanley', 'TWAP', 'MSFT', 'MSFT.O', 'NASDAQ', 'Equity', 'Sarah Johnson', 'Morgan Stanley', 'MS001', 'ACC-002', 'Sell', 'Market', 'Day', 'Filled', 5000, 5000, 0, 100.00, 380.00, 379.85, 'USD', 1900000.00, 1899250.00),
    (5, 'Fidelity', 'TWAP', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 8000, 5000, 3000, 62.50, 875.50, 874.90, 'USD', 7004000.00, 4374500.00),
    (5, 'Fidelity', 'POV', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 7000, 4000, 3000, 57.14, 875.50, 874.70, 'USD', 6128500.00, 3498800.00);

-- Insert some Market Orders
INSERT INTO market_orders (
    parent_id, client, symbol, ric, exchange, product, trader, client_name, client_code, account,
    side, type, tif, state, quantity, done_quantity, available_quantity, done_percent, 
    price, average_price, currency, order_value, done_value
) VALUES
    (1, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Filled', 100, 100, 0, 100.00, 175.45, 175.45, 'USD', 17545.00, 17545.00),
    (1, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Filled', 150, 150, 0, 100.00, 175.52, 175.52, 'USD', 26328.00, 26328.00),
    (1, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Partial', 200, 120, 80, 60.00, 175.48, 175.48, 'USD', 35096.00, 21057.60),
    (2, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Filled', 80, 80, 0, 100.00, 175.35, 175.35, 'USD', 14028.00, 14028.00),
    (2, 'Goldman Sachs', 'AAPL', 'AAPL.O', 'NASDAQ', 'Equity', 'John Smith', 'Goldman Sachs', 'GS001', 'ACC-001', 'Buy', 'Limit', 'GTC', 'Pending', 120, 0, 120, 0.00, 175.40, 0, 'USD', 21048.00, 0),
    (4, 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Filled', 50, 50, 0, 100.00, 875.25, 875.25, 'USD', 43762.50, 43762.50),
    (4, 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Partial', 100, 75, 25, 75.00, 875.45, 875.45, 'USD', 87545.00, 65658.75),
    (5, 'Fidelity', 'NVDA', 'NVDA.O', 'NASDAQ', 'Equity', 'Tom Brown', 'Fidelity', 'FID001', 'ACC-007', 'Buy', 'Limit', 'GTC', 'Filled', 60, 60, 0, 100.00, 875.30, 875.30, 'USD', 52518.00, 52518.00);