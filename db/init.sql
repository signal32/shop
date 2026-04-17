create extension if not exists "uuid-ossp";

create schema shop;

create table shop.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  available boolean not null default false,
  price numeric default null,
  meta jsonb not null default '{}'::jsonb,
  -- things to include here are:
  -- a list of avaliable options, their possible values, and their current value (JSONB)
  -- stripe stuff
  stripe_price_id text,
  fulfillment_webhook text
);

insert into shop.products (name, meta, stripe_price_id) values
  (
    'Speyside Line',
    '{"headerImageUrl": "https://s3.finch.hamishweir.uk/shop-public/Screenshot_SB-The-Speyside-Line_57.45819-3.35020_12-00-36-1920x1080.jpg"}',
    'price_1T0LBKIqdfED53D6B17D0slE'
    );

insert into shop.products (id, name, meta, stripe_price_id, fulfillment_webhook) values
  (
  '5bb0a699-f964-431e-9605-0d896b642108',
  'Train Simulator Classic Custom Sign',
  '{}',
  'price_1T2IA9IqdfED53D6pb6Porkf',
  'http://localhost:3004/fulfillSignOrder'
  );

create table shop.files (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    path text not null
)
;
create table shop.product_files (
    product_id uuid references shop.products (id) on delete cascade,
    file_id uuid references shop.files (id) on delete cascade
);

create table shop.orders (
    id uuid primary key default uuid_generate_v4(),
    paid boolean not null default false
);

create table shop.order_products (
    order_id uuid references shop.orders (id) on delete cascade,
    product_id uuid references shop.products (id) on delete cascade,
    config_id text,
    options jsonb not null default '{}'::jsonb,
    meta jsonb not null default '{}'::jsonb,
    quantity int not null default 1,
    files jsonb not null default '{}'::jsonb,
    fulfilled boolean not null default false,
    primary key (order_id, product_id, config_id)
);

create role web_anon nologin;

grant usage on schema shop to web_anon;
grant select on shop.products to web_anon;
grant select on shop.files to web_anon;
grant select on shop.product_files to web_anon;
grant select on shop.orders to web_anon;
grant insert on shop.orders to web_anon;
grant update on shop.orders to web_anon;
grant select on shop.order_products to web_anon;
grant insert on shop.order_products to web_anon;
grant update on shop.order_products to web_anon;

create role authenticator noinherit login password 'mysecretpassword';
grant web_anon to authenticator;
