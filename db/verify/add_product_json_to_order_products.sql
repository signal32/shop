-- Verify signal32/shop:add_product_json_to_order_products on pg

BEGIN;

    DO $$
    BEGIN
        ASSERT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'shop'
              AND table_name = 'order_products'
              AND column_name = 'product'
              AND data_type = 'jsonb'
        ), 'product column should exist and be of type jsonb';
    END;
    $$;

ROLLBACK;
