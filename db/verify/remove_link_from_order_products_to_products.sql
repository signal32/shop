-- Verify signal32/shop:remove_link_from_order_products_to_products on pg

BEGIN;

    DO $$
    BEGIN
        ASSERT (
            SELECT data_type = 'text'
            FROM information_schema.columns
            WHERE table_schema = 'shop'
              AND table_name = 'order_products'
              AND column_name = 'product_id'
        ), 'product_id should be text';

        ASSERT NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_schema = 'shop'
              AND table_name = 'order_products'
              AND constraint_name = 'order_products_product_id_fkey'
        ), 'product_id foreign key should not exist';
    END;
    $$;

ROLLBACK;
