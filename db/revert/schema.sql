-- Revert signal32/shop:schema from pg

BEGIN;

DROP SCHEMA IF EXISTS shop CASCADE;
DROP TYPE IF EXISTS fulfillment_status;

COMMIT;
