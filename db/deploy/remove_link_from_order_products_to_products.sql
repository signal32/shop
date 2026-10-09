-- Deploy signal32/shop:remove_link_from_order_products_to_products to pg

BEGIN;

BEGIN;
-- Drop the foreign key constraint referencing shop.products
ALTER TABLE shop.order_products
    DROP CONSTRAINT order_products_product_id_fkey;

-- Change product_id from uuid to text
ALTER TABLE shop.order_products
    ALTER COLUMN product_id TYPE text
    USING product_id::text;

COMMIT;

COMMIT;
