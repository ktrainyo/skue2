create table public.new_token_data (
  id serial not null,
  name text null,
  symbol text null,
  uri text null,
  decimals integer null,
  has_file_metadata boolean null,
  created_on text null,
  description text null,
  image text null,
  show_name boolean null,
  twitter text null,
  telegram text null,
  website text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  processed boolean null default false,
  mint_address_new text null,
  constraint new_token_data_pkey primary key (id)
) tablespace pg_default;
ALTER TABLE new_token_data DROP COLUMN IF EXISTS mint_address;
create trigger after_insert_or_update_new_token
after
insert
  or
update on new_token_data for each row
  when (
    new.processed is distinct
    from true
  ) execute function trigger_process_new_token ();
create table public.new_token_events (
  id serial not null,
  token_id integer null,
  interval text null,
  price_change_percentage numeric null,
  constraint new_token_events_pkey primary key (id),
  constraint unique_token_interval unique (token_id, "interval"),
  constraint new_token_events_token_id_fkey foreign key (token_id) references new_token_data (id) on delete cascade
) tablespace pg_default;
create table public.new_token_pools (
  id serial not null,
  token_id integer null,
  pool_id text null,
  quote_liquidity numeric null,
  usd_liquidity numeric null,
  quote_price numeric null,
  usd_price numeric null,
  token_supply numeric null,
  lp_burn numeric null,
  market_cap_quote numeric null,
  market_cap_usd numeric null,
  freeze_authority text null,
  mint_authority text null,
  quote_token text null,
  market text null,
  curve_percentage numeric null,
  curve_address text null,
  last_updated bigint null,
  created_at bigint null,
  deployer text null,
  buys integer null,
  total_txns integer null,
  volume numeric null,
  sells integer null,
  open_time bigint null,
  constraint new_token_pools_pkey primary key (id),
  constraint unique_pool_id unique (pool_id),
  constraint new_token_pools_token_id_fkey foreign key (token_id) references new_token_data (id) on delete cascade
) tablespace pg_default;
create table public.new_token_risks (
  id serial not null,
  token_id integer null,
  rugged boolean null,
  risk_name text null,
  risk_description text null,
  risk_level text null,
  risk_score integer null,
  overall_risk_score integer null,
  constraint new_token_risks_pkey primary key (id),
  constraint unique_token_risk_name unique (token_id, risk_name),
  constraint new_token_risks_token_id_fkey foreign key (token_id) references new_token_data (id) on delete cascade
) tablespace pg_default;
