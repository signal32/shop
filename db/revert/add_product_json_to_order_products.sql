-- Revert signal32/shop:add_product_json_to_order_products from pg

BEGIN;

ALTER TABLE shop.order_products
    DROP COLUMN product;

COMMIT;
