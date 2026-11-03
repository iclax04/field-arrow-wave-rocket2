alter table activity_log drop constraint if exists activity_kind_chk;
alter table activity_log add constraint activity_kind_chk check (kind in (
  'login', 'deposit', 'withdrawal', 'mint', 'purchase', 'sale', 'offer', 'bid', 'profile', 'sign_out'
));

create table if not exists revoked_sessions (
  token text primary key,
  user_id text not null,
  expires_at timestamptz not null
);

alter table profiles add column if not exists phone text not null default '';
alter table profiles add column if not exists region text not null default '';
alter table profiles add column if not exists postal_code text not null default '';

create table if not exists contact_messages (
  id serial primary key,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now()
);
