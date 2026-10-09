-- Revert signal32/shop:remove_link_from_order_products_to_products from pg

BEGIN;

-- Convert product_id back to uuid
ALTER TABLE shop.order_products
    ALTER COLUMN product_id TYPE uuid
    USING product_id::uuid;

-- Restore the foreign key constraint
ALTER TABLE shop.order_products
    ADD CONSTRAINT order_products_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES shop.products(id)
    ON DELETE CASCADE;

COMMIT;
