-- Account activity for Agora Gallery NFTs.
-- Login, mint, purchase, deposit, and withdrawal rows land here.
-- Balances stay on profiles; this table is the history, not the ledger.

create table if not exists activity_log (
  id serial primary key,
  user_id text not null,
  kind text not null,
  detail text not null default '',
  created_at timestamptz not null default now(),
  constraint activity_kind_chk check (kind in (
    'login', 'deposit', 'withdrawal', 'mint', 'purchase', 'sale', 'offer', 'bid', 'profile'
  ))
);

create index if not exists activity_user_idx on activity_log (user_id, created_at desc);

alter table settings add column if not exists gallery_name text not null default 'Agora Gallery NFTs';
alter table settings add column if not exists tagline text not null default 'Mint a work. Collect it. The royalty stays with the artist.';
