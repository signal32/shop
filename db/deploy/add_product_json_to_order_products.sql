-- Deploy signal32/shop:add_product_json_to_order_products to pg

BEGIN;

ALTER TABLE shop.order_products
    ADD COLUMN product jsonb;

COMMIT;
