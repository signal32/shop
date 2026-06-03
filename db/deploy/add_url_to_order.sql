-- Deploy signal32/shop:add_url_to_order to pg

BEGIN;

ALTER TABLE shop.orders
ADD COLUMN url text;

COMMIT;
