create table if not exists admin_accounts (
  id text primary key,
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'super',
  must_change_password boolean not null default true,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  constraint admin_role_chk check (role in ('super', 'support'))
);

create table if not exists admin_sessions (
  token text primary key,
  admin_id text not null references admin_accounts (id) on delete cascade,
  expires_at timestamptz not null,
  last_seen timestamptz not null default now(),
  ip text not null default ''
);

create table if not exists deposit_address_history (
  id serial primary key,
  address text not null,
  actor_id text not null,
  created_at timestamptz not null default now()
);

alter table settings add column if not exists platform_deposit_address text not null default '';
alter table settings add column if not exists support_email text not null default 'support@agoragallery.nfts';
alter table settings add column if not exists announcement text not null default '';
alter table settings add column if not exists auto_approve_enabled boolean not null default false;
alter table settings add column if not exists withdrawal_warn_eth numeric(18, 6) not null default 5;

alter table profiles add column if not exists use_platform_deposit boolean not null default true;

alter table deposits drop constraint if exists deposits_status_chk;
alter table deposits add constraint deposits_status_chk check (status in ('pending', 'confirming', 'completed', 'failed', 'approved', 'rejected'));
alter table deposits add column if not exists reject_reason text;

alter table audit_log add column if not exists ip text not null default '';
alter table audit_log add column if not exists old_value text;
alter table audit_log add column if not exists new_value text;
