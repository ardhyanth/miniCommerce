-- Create products table
CREATE TABLE products (
  sku text PRIMARY KEY,
  name text UNIQUE NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  stock numeric DEFAULT 0 NOT NULL,
  description text NULL
);

-- Create transaction adjustments table
CREATE TABLE transaction_adjustments (
  id SERIAL PRIMARY KEY,
  sku text REFERENCES products (sku) ON DELETE cascade,
  qty numeric,
  amount numeric DEFAULT 0 NOT NULL
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  sku text REFERENCES products (sku),
  qty numeric NOT NULL,
  status text NOT NULL
);

-- Create function to recalculate stock amount
CREATE OR REPLACE FUNCTION recalculate_stock() RETURNS TRIGGER AS
$BODY$
DECLARE
  item_stock numeric;

BEGIN
  SELECT SUM(qty)
    INTO item_stock
  FROM transaction_adjustments
  WHERE transaction_adjustments.sku = COALESCE(NEW.sku, OLD.sku);

  UPDATE products
    SET stock = COALESCE(item_stock, 0)
  WHERE sku = COALESCE(NEW.sku, OLD.sku);

  RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

-- Create trigger to call recalculate stock amount function
CREATE TRIGGER add_stock_trigger
  AFTER INSERT OR UPDATE OR DELETE
    ON transaction_adjustments
  FOR EACH ROW
    EXECUTE PROCEDURE recalculate_stock();

-- Create function to calculate transaction adjustment amount
CREATE OR REPLACE FUNCTION calculate_amount() RETURNS TRIGGER AS
$BODY$
DECLARE
  item_price numeric;
  item_stock numeric;

BEGIN
  SELECT price, stock
    INTO item_price, item_stock
  FROM products
  WHERE products.sku = NEW.sku;

  IF (item_stock = 0 AND NEW.qty < 0) OR (NEW.qty< 0 AND item_stock < -NEW.qty)
    THEN RAISE 'not enough stock';
  END IF;

  New.amount := ABS(item_price * New.qty);

  RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

-- Create trigger to call calculate transaction adjustment amount function
CREATE TRIGGER calculate_amount_trigger
  BEFORE INSERT OR UPDATE
    ON transaction_adjustments
  FOR EACH ROW
    EXECUTE PROCEDURE calculate_amount();
