-- Revert signal32/shop:add_product_created_and_updated from pg

BEGIN;

DROP TRIGGER IF EXISTS trg_products_updated
    ON shop.products;

DROP FUNCTION IF EXISTS shop.set_updated();

ALTER TABLE shop.products
    DROP COLUMN IF EXISTS updated,
    DROP COLUMN IF EXISTS created;

COMMIT;
