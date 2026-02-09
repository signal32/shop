create extension if not exists "uuid-ossp";

create schema shop;

create table shop.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  available boolean not null default false,
  price numeric default null

  -- things to include here are:
  -- a list of avaliable options, their possible values, and their current value (JSONB)
  -- stripe stuff
);

insert into shop.products (name) values
  ('Speyside Line'), ('Train sim custom signs and stuff');

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
    id uuid primary key default uuid_generate_v4()
);

create table shop.order_products (
    order_id uuid references shop.orders (id) on delete cascade,
    product_id uuid references shop.products (id) on delete cascade
);

create role web_anon nologin;

grant usage on schema shop to web_anon;
grant select on shop.products to web_anon;
grant select on shop.files to web_anon;
grant select on shop.product_files to web_anon;
grant select on shop.orders to web_anon;
grant select on shop.order_products to web_anon;

create role authenticator noinherit login password 'mysecretpassword';
grant web_anon to authenticator;
