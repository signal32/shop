-- Deploy signal32/shop:add_email_to_order to pg

BEGIN;

ALTER TABLE shop.orders
ADD COLUMN email text;

COMMIT;
