-- Revert signal32/shop:add_url_to_order from pg

BEGIN;

ALTER TABLE shop.orders
DROP COLUMN url;

COMMIT;
