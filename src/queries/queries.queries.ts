/** Types generated for queries found in "src/queries/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'FindOrderById' parameters type */
export interface IFindOrderByIdParams {
  orderId?: string | null | void;
}

/** 'FindOrderById' return type */
export interface IFindOrderByIdResult {
  id: string;
  paid: boolean;
}

/** 'FindOrderById' query type */
export interface IFindOrderByIdQuery {
  params: IFindOrderByIdParams;
  result: IFindOrderByIdResult;
}

const findOrderByIdIR: any = {"usedParamSet":{"orderId":true},"params":[{"name":"orderId","required":false,"transform":{"type":"scalar"},"locs":[{"a":37,"b":44}]}],"statement":"SELECT * FROM shop.orders WHERE id = :orderId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM shop.orders WHERE id = :orderId
 * ```
 */
export const findOrderById = new PreparedQuery<IFindOrderByIdParams,IFindOrderByIdResult>(findOrderByIdIR);


/** 'SetOrderPaid' parameters type */
export interface ISetOrderPaidParams {
  id: string;
  paid: boolean;
}

/** 'SetOrderPaid' return type */
export interface ISetOrderPaidResult {
  id: string;
  paid: boolean;
}

/** 'SetOrderPaid' query type */
export interface ISetOrderPaidQuery {
  params: ISetOrderPaidParams;
  result: ISetOrderPaidResult;
}

const setOrderPaidIR: any = {"usedParamSet":{"paid":true,"id":true},"params":[{"name":"paid","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":35}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":48,"b":51}]}],"statement":"UPDATE shop.orders\nSET paid = :paid!\nWHERE id = :id!\nRETURNING id, paid"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE shop.orders
 * SET paid = :paid!
 * WHERE id = :id!
 * RETURNING id, paid
 * ```
 */
export const setOrderPaid = new PreparedQuery<ISetOrderPaidParams,ISetOrderPaidResult>(setOrderPaidIR);


/** 'UpsertOrder' parameters type */
export interface IUpsertOrderParams {
  id: string;
  paid?: boolean | null | void;
}

/** 'UpsertOrder' return type */
export interface IUpsertOrderResult {
  id: string;
  paid: boolean;
}

/** 'UpsertOrder' query type */
export interface IUpsertOrderQuery {
  params: IUpsertOrderParams;
  result: IUpsertOrderResult;
}

const upsertOrderIR: any = {"usedParamSet":{"id":true,"paid":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":43,"b":46}]},{"name":"paid","required":false,"transform":{"type":"scalar"},"locs":[{"a":58,"b":62}]}],"statement":"INSERT INTO shop.orders (id, paid)\nVALUES (:id!, COALESCE(:paid, false))\nON CONFLICT (id)\nDO UPDATE SET\n  paid = COALESCE(EXCLUDED.paid, shop.orders.paid)\nRETURNING id, paid"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO shop.orders (id, paid)
 * VALUES (:id!, COALESCE(:paid, false))
 * ON CONFLICT (id)
 * DO UPDATE SET
 *   paid = COALESCE(EXCLUDED.paid, shop.orders.paid)
 * RETURNING id, paid
 * ```
 */
export const upsertOrder = new PreparedQuery<IUpsertOrderParams,IUpsertOrderResult>(upsertOrderIR);


/** 'FindProductsInOrder' parameters type */
export interface IFindProductsInOrderParams {
  orderId?: string | null | void;
}

/** 'FindProductsInOrder' return type */
export interface IFindProductsInOrderResult {
  config_id: string;
  files: Json;
  fulfilled: boolean;
  meta: Json;
  options: Json;
  order_id: string;
  product_id: string;
  quantity: number;
}

/** 'FindProductsInOrder' query type */
export interface IFindProductsInOrderQuery {
  params: IFindProductsInOrderParams;
  result: IFindProductsInOrderResult;
}

const findProductsInOrderIR: any = {"usedParamSet":{"orderId":true},"params":[{"name":"orderId","required":false,"transform":{"type":"scalar"},"locs":[{"a":51,"b":58}]}],"statement":"select * from shop.order_products where order_id = :orderId"};

/**
 * Query generated from SQL:
 * ```
 * select * from shop.order_products where order_id = :orderId
 * ```
 */
export const findProductsInOrder = new PreparedQuery<IFindProductsInOrderParams,IFindProductsInOrderResult>(findProductsInOrderIR);


/** 'UpsertOrderProduct' parameters type */
export interface IUpsertOrderProductParams {
  config_id: string;
  files?: Json | null | void;
  fulfilled?: boolean | null | void;
  meta?: Json | null | void;
  options?: Json | null | void;
  order_id: string;
  product_id: string;
  quantity?: number | null | void;
}

/** 'UpsertOrderProduct' return type */
export interface IUpsertOrderProductResult {
  config_id: string;
  files: Json;
  fulfilled: boolean;
  meta: Json;
  options: Json;
  order_id: string;
  product_id: string;
  quantity: number;
}

/** 'UpsertOrderProduct' query type */
export interface IUpsertOrderProductQuery {
  params: IUpsertOrderProductParams;
  result: IUpsertOrderProductResult;
}

const upsertOrderProductIR: any = {"usedParamSet":{"order_id":true,"product_id":true,"config_id":true,"options":true,"meta":true,"quantity":true,"files":true,"fulfilled":true},"params":[{"name":"order_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":147}]},{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":152,"b":163}]},{"name":"config_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":168,"b":178}]},{"name":"options","required":false,"transform":{"type":"scalar"},"locs":[{"a":192,"b":199},{"a":420,"b":427}]},{"name":"meta","required":false,"transform":{"type":"scalar"},"locs":[{"a":227,"b":231},{"a":478,"b":482}]},{"name":"quantity","required":false,"transform":{"type":"scalar"},"locs":[{"a":259,"b":267},{"a":534,"b":542}]},{"name":"files","required":false,"transform":{"type":"scalar"},"locs":[{"a":285,"b":290},{"a":595,"b":600}]},{"name":"fulfilled","required":false,"transform":{"type":"scalar"},"locs":[{"a":318,"b":327},{"a":654,"b":663}]}],"statement":"INSERT INTO shop.order_products (\n  order_id,\n  product_id,\n  config_id,\n  options,\n  meta,\n  quantity,\n  files,\n  fulfilled\n)\nVALUES (\n  :order_id!,\n  :product_id!,\n  :config_id!,\n  COALESCE(:options, '{}'::jsonb),\n  COALESCE(:meta, '{}'::jsonb),\n  COALESCE(:quantity, 1),\n  COALESCE(:files, '{}'::jsonb),\n  COALESCE(:fulfilled, false)\n)\nON CONFLICT (order_id, product_id, config_id)\nDO UPDATE SET\n  options = COALESCE(:options, shop.order_products.options),\n  meta = COALESCE(:meta, shop.order_products.meta),\n  quantity = COALESCE(:quantity, shop.order_products.quantity),\n  files = COALESCE(:files, shop.order_products.files),\n  fulfilled = COALESCE(:fulfilled, shop.order_products.fulfilled)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO shop.order_products (
 *   order_id,
 *   product_id,
 *   config_id,
 *   options,
 *   meta,
 *   quantity,
 *   files,
 *   fulfilled
 * )
 * VALUES (
 *   :order_id!,
 *   :product_id!,
 *   :config_id!,
 *   COALESCE(:options, '{}'::jsonb),
 *   COALESCE(:meta, '{}'::jsonb),
 *   COALESCE(:quantity, 1),
 *   COALESCE(:files, '{}'::jsonb),
 *   COALESCE(:fulfilled, false)
 * )
 * ON CONFLICT (order_id, product_id, config_id)
 * DO UPDATE SET
 *   options = COALESCE(:options, shop.order_products.options),
 *   meta = COALESCE(:meta, shop.order_products.meta),
 *   quantity = COALESCE(:quantity, shop.order_products.quantity),
 *   files = COALESCE(:files, shop.order_products.files),
 *   fulfilled = COALESCE(:fulfilled, shop.order_products.fulfilled)
 * RETURNING *
 * ```
 */
export const upsertOrderProduct = new PreparedQuery<IUpsertOrderProductParams,IUpsertOrderProductResult>(upsertOrderProductIR);


/** 'FindProductById' parameters type */
export interface IFindProductByIdParams {
  productId?: string | null | void;
}

/** 'FindProductById' return type */
export interface IFindProductByIdResult {
  available: boolean;
  description: string;
  fulfillment_webhook: string | null;
  id: string;
  meta: Json;
  name: string;
  price: string | null;
  stripe_price_id: string | null;
}

/** 'FindProductById' query type */
export interface IFindProductByIdQuery {
  params: IFindProductByIdParams;
  result: IFindProductByIdResult;
}

const findProductByIdIR: any = {"usedParamSet":{"productId":true},"params":[{"name":"productId","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":48}]}],"statement":"select * from shop.products where id = :productId"};

/**
 * Query generated from SQL:
 * ```
 * select * from shop.products where id = :productId
 * ```
 */
export const findProductById = new PreparedQuery<IFindProductByIdParams,IFindProductByIdResult>(findProductByIdIR);


