/* @name FindOrderById */
SELECT * FROM shop.orders WHERE id = :orderId;

/* @name SetOrderPaid */
UPDATE shop.orders
SET paid = :paid!
WHERE id = :id!
RETURNING id, paid;

/* @name UpsertOrder */
INSERT INTO shop.orders (id, paid)
VALUES (:id!, COALESCE(:paid, false))
ON CONFLICT (id)
DO UPDATE SET
  paid = COALESCE(EXCLUDED.paid, shop.orders.paid)
RETURNING id, paid;

/* @name FindProductsInOrder */
select * from shop.order_products where order_id = :orderId;

/* @name UpsertOrderProduct */
INSERT INTO shop.order_products (
  order_id,
  product_id,
  config_id,
  options,
  meta,
  quantity,
  files,
  fulfillment_status
)
VALUES (
  :order_id!,
  :product_id!,
  :config_id!,
  COALESCE(:options, '{}'::jsonb),
  COALESCE(:meta, '{}'::jsonb),
  COALESCE(:quantity, 1),
  COALESCE(:files, '{}'::jsonb),
  COALESCE(:fulfillment_status::fulfillment_status, null)
)
ON CONFLICT (order_id, product_id, config_id)
DO UPDATE SET
  options = COALESCE(:options, shop.order_products.options),
  meta = COALESCE(:meta, shop.order_products.meta),
  quantity = COALESCE(:quantity, shop.order_products.quantity),
  files = COALESCE(:files, shop.order_products.files),
  fulfillment_status = COALESCE(:fulfillment_status::fulfillment_status, shop.order_products.fulfillment_status)
RETURNING *;

/* @name FindProductById */
select * from shop.products where id = :productId;


/* @name FindProducts */
select *
from shop.products
where (:productIds::uuid[] is null or id = any(:productIds));
