-- Oriel exchange: studios, works, listings, and the internal ETH ledger.

create table if not exists profiles (
  user_id text primary key,
  username text unique not null,
  display_name text not null,
  bio text not null default '',
  city text not null default '',
  avatar_url text,
  wallet_address text not null default '',
  deposit_address text unique,
  role text not null default 'user',
  status text not null default 'active',
  site_url text,
  x_handle text,
  balance numeric(18, 6) not null default 0,
  locked_balance numeric(18, 6) not null default 0,
  created_at timestamptz not null default now(),
  constraint profiles_role_chk check (role in ('user', 'admin', 'catalog', 'treasury')),
  constraint profiles_status_chk check (status in ('active', 'suspended', 'banned', 'deleted')),
  constraint profiles_balance_chk check (balance >= 0 and locked_balance >= 0)
);

create table if not exists categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  sort int not null default 0
);

create table if not exists settings (
  id int primary key default 1,
  platform_fee_bps int not null default 250,
  mint_fee numeric(18, 6) not null default 0.200000,
  min_withdrawal numeric(18, 6) not null default 0.050000,
  confirmations_required int not null default 12,
  auto_approve_under numeric(18, 6) not null default 0,
  hot_wallet_balance numeric(18, 6) not null default 25,
  hot_wallet_alert numeric(18, 6) not null default 5,
  network_fee numeric(18, 6) not null default 0.002000,
  featured_title text not null default 'First Light',
  constraint settings_fee_chk check (platform_fee_bps >= 0 and platform_fee_bps <= 2000),
  constraint settings_conf_chk check (confirmations_required >= 1 and confirmations_required <= 64)
);

insert into settings (id) values (1) on conflict (id) do nothing;

create table if not exists artworks (
  id serial primary key,
  token_id int unique not null,
  creator_id text not null,
  owner_id text not null,
  title text not null,
  description text not null default '',
  category_slug text not null,
  media_kind text not null default 'image',
  image_url text not null,
  media_url text,
  royalty_bps int not null default 0,
  featured boolean not null default false,
  hidden boolean not null default false,
  removed boolean not null default false,
  likes_count int not null default 0,
  created_at timestamptz not null default now(),
  constraint artworks_royalty_chk check (royalty_bps >= 0 and royalty_bps <= 1000),
  constraint artworks_media_chk check (media_kind in ('image', 'video', 'audio'))
);

create table if not exists listings (
  id serial primary key,
  artwork_id int not null references artworks (id),
  seller_id text not null,
  kind text not null,
  price numeric(18, 6) not null,
  ends_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint listings_kind_chk check (kind in ('fixed', 'auction')),
  constraint listings_status_chk check (status in ('active', 'sold', 'cancelled', 'ended')),
  constraint listings_price_chk check (price > 0)
);

create unique index if not exists listings_one_active on listings (artwork_id) where status = 'active';

create table if not exists bids (
  id serial primary key,
  listing_id int not null references listings (id),
  bidder_id text not null,
  amount numeric(18, 6) not null,
  status text not null default 'leading',
  created_at timestamptz not null default now(),
  constraint bids_status_chk check (status in ('leading', 'refunded', 'won')),
  constraint bids_amount_chk check (amount > 0)
);

create unique index if not exists bids_one_leading on bids (listing_id) where status = 'leading';

create table if not exists offers (
  id serial primary key,
  artwork_id int not null references artworks (id),
  bidder_id text not null,
  amount numeric(18, 6) not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint offers_status_chk check (status in ('active', 'accepted', 'rejected', 'withdrawn')),
  constraint offers_amount_chk check (amount > 0)
);

create unique index if not exists offers_one_active on offers (artwork_id, bidder_id) where status = 'active';

create table if not exists transactions (
  id serial primary key,
  artwork_id int,
  buyer_id text,
  seller_id text,
  price numeric(18, 6) not null default 0,
  royalty_amount numeric(18, 6) not null default 0,
  platform_fee numeric(18, 6) not null default 0,
  seller_proceeds numeric(18, 6) not null default 0,
  kind text not null,
  tx_hash text,
  note text,
  created_at timestamptz not null default now(),
  constraint transactions_kind_chk check (kind in (
    'sale', 'auction', 'offer', 'mint', 'mint_fee', 'deposit', 'withdrawal', 'royalty', 'adjustment'
  ))
);

create table if not exists favorites (
  user_id text not null,
  artwork_id int not null references artworks (id),
  created_at timestamptz not null default now(),
  primary key (user_id, artwork_id)
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id serial primary key,
  actor_id text not null,
  action text not null,
  target text,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists deposits (
  id serial primary key,
  user_id text not null,
  tx_hash text unique not null,
  amount numeric(18, 6) not null,
  confirmations int not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deposits_status_chk check (status in ('pending', 'confirming', 'completed', 'failed')),
  constraint deposits_amount_chk check (amount > 0)
);

create table if not exists withdrawals (
  id serial primary key,
  user_id text not null,
  amount numeric(18, 6) not null,
  network_fee numeric(18, 6) not null,
  destination text not null,
  status text not null default 'pending',
  tx_hash text,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint withdrawals_status_chk check (status in ('pending', 'approved', 'processing', 'completed', 'rejected')),
  constraint withdrawals_amount_chk check (amount > 0)
);

create index if not exists artworks_creator_idx on artworks (creator_id);
create index if not exists artworks_owner_idx on artworks (owner_id);
create index if not exists listings_status_idx on listings (status);
create index if not exists transactions_created_idx on transactions (created_at desc);
create index if not exists deposits_user_idx on deposits (user_id, created_at desc);
create index if not exists withdrawals_status_idx on withdrawals (status, created_at desc);
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);
create index if not exists audit_created_idx on audit_log (created_at desc);
