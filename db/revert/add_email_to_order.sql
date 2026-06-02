-- Revert signal32/shop:add_email_to_order from pg

BEGIN;

ALTER TABLE shop.orders
DROP COLUMN email;

COMMIT;
