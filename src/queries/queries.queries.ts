/** Types generated for queries found in "src/queries/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type fulfillment_status = 'failed' | 'fulfilled' | 'pending';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type stringArray = (string)[];

/** 'FindOrderById' parameters type */
export interface IFindOrderByIdParams {
  orderId?: string | null | void;
}

/** 'FindOrderById' return type */
export interface IFindOrderByIdResult {
  email: string | null;
  id: string;
  paid: boolean;
  url: string | null;
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
  email?: string | null | void;
  id: string;
  paid?: boolean | null | void;
  url?: string | null | void;
}

/** 'UpsertOrder' return type */
export interface IUpsertOrderResult {
  email: string | null;
  id: string;
  paid: boolean;
  url: string | null;
}

/** 'UpsertOrder' query type */
export interface IUpsertOrderQuery {
  params: IUpsertOrderParams;
  result: IUpsertOrderResult;
}

const upsertOrderIR: any = {"usedParamSet":{"id":true,"paid":true,"email":true,"url":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":63}]},{"name":"paid","required":false,"transform":{"type":"scalar"},"locs":[{"a":79,"b":83}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":107,"b":112}]},{"name":"url","required":false,"transform":{"type":"scalar"},"locs":[{"a":135,"b":138}]}],"statement":"INSERT INTO shop.orders (id, paid, email, url)\nVALUES (\n    :id!,\n    COALESCE(:paid, false),\n    COALESCE(:email, null),\n    COALESCE(:url, null)\n)\nON CONFLICT (id)\nDO UPDATE SET\n  paid = COALESCE(EXCLUDED.paid, shop.orders.paid),\n  email = COALESCE(EXCLUDED.email, shop.orders.email),\n  url = COALESCE(EXCLUDED.url, shop.orders.url)\nRETURNING id, paid, email, url"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO shop.orders (id, paid, email, url)
 * VALUES (
 *     :id!,
 *     COALESCE(:paid, false),
 *     COALESCE(:email, null),
 *     COALESCE(:url, null)
 * )
 * ON CONFLICT (id)
 * DO UPDATE SET
 *   paid = COALESCE(EXCLUDED.paid, shop.orders.paid),
 *   email = COALESCE(EXCLUDED.email, shop.orders.email),
 *   url = COALESCE(EXCLUDED.url, shop.orders.url)
 * RETURNING id, paid, email, url
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
  fulfillment_status: fulfillment_status | null;
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
  fulfillment_status?: fulfillment_status | null | void;
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
  fulfillment_status: fulfillment_status | null;
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

const upsertOrderProductIR: any = {"usedParamSet":{"order_id":true,"product_id":true,"config_id":true,"options":true,"meta":true,"quantity":true,"files":true,"fulfillment_status":true},"params":[{"name":"order_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":156}]},{"name":"product_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":161,"b":172}]},{"name":"config_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":177,"b":187}]},{"name":"options","required":false,"transform":{"type":"scalar"},"locs":[{"a":201,"b":208},{"a":457,"b":464}]},{"name":"meta","required":false,"transform":{"type":"scalar"},"locs":[{"a":236,"b":240},{"a":515,"b":519}]},{"name":"quantity","required":false,"transform":{"type":"scalar"},"locs":[{"a":268,"b":276},{"a":571,"b":579}]},{"name":"files","required":false,"transform":{"type":"scalar"},"locs":[{"a":294,"b":299},{"a":632,"b":637}]},{"name":"fulfillment_status","required":false,"transform":{"type":"scalar"},"locs":[{"a":327,"b":345},{"a":700,"b":718}]}],"statement":"INSERT INTO shop.order_products (\n  order_id,\n  product_id,\n  config_id,\n  options,\n  meta,\n  quantity,\n  files,\n  fulfillment_status\n)\nVALUES (\n  :order_id!,\n  :product_id!,\n  :config_id!,\n  COALESCE(:options, '{}'::jsonb),\n  COALESCE(:meta, '{}'::jsonb),\n  COALESCE(:quantity, 1),\n  COALESCE(:files, '{}'::jsonb),\n  COALESCE(:fulfillment_status::fulfillment_status, null)\n)\nON CONFLICT (order_id, product_id, config_id)\nDO UPDATE SET\n  options = COALESCE(:options, shop.order_products.options),\n  meta = COALESCE(:meta, shop.order_products.meta),\n  quantity = COALESCE(:quantity, shop.order_products.quantity),\n  files = COALESCE(:files, shop.order_products.files),\n  fulfillment_status = COALESCE(:fulfillment_status::fulfillment_status, shop.order_products.fulfillment_status)\nRETURNING *"};

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
 *   fulfillment_status
 * )
 * VALUES (
 *   :order_id!,
 *   :product_id!,
 *   :config_id!,
 *   COALESCE(:options, '{}'::jsonb),
 *   COALESCE(:meta, '{}'::jsonb),
 *   COALESCE(:quantity, 1),
 *   COALESCE(:files, '{}'::jsonb),
 *   COALESCE(:fulfillment_status::fulfillment_status, null)
 * )
 * ON CONFLICT (order_id, product_id, config_id)
 * DO UPDATE SET
 *   options = COALESCE(:options, shop.order_products.options),
 *   meta = COALESCE(:meta, shop.order_products.meta),
 *   quantity = COALESCE(:quantity, shop.order_products.quantity),
 *   files = COALESCE(:files, shop.order_products.files),
 *   fulfillment_status = COALESCE(:fulfillment_status::fulfillment_status, shop.order_products.fulfillment_status)
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
  created: Date;
  description: string;
  fulfillment_webhook: string | null;
  id: string;
  meta: Json;
  name: string;
  price: string | null;
  stripe_price_id: string | null;
  updated: Date;
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


/** 'FindProducts' parameters type */
export interface IFindProductsParams {
  productIds?: stringArray | null | void;
}

/** 'FindProducts' return type */
export interface IFindProductsResult {
  available: boolean;
  created: Date;
  description: string;
  fulfillment_webhook: string | null;
  id: string;
  meta: Json;
  name: string;
  price: string | null;
  stripe_price_id: string | null;
  updated: Date;
}

/** 'FindProducts' query type */
export interface IFindProductsQuery {
  params: IFindProductsParams;
  result: IFindProductsResult;
}

const findProductsIR: any = {"usedParamSet":{"productIds":true},"params":[{"name":"productIds","required":false,"transform":{"type":"scalar"},"locs":[{"a":35,"b":45},{"a":75,"b":85}]}],"statement":"select *\nfrom shop.products\nwhere (:productIds::uuid[] is null or id = any(:productIds))"};

/**
 * Query generated from SQL:
 * ```
 * select *
 * from shop.products
 * where (:productIds::uuid[] is null or id = any(:productIds))
 * ```
 */
export const findProducts = new PreparedQuery<IFindProductsParams,IFindProductsResult>(findProductsIR);


