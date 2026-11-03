-- Catalog studios and works. House accounts are not login users.

insert into categories (slug, name, sort) values
  ('photography', 'Photography', 1),
  ('painting', 'Painting', 2),
  ('textile', 'Textile', 3),
  ('object', 'Object', 4),
  ('installation', 'Installation', 5)
on conflict (slug) do nothing;

insert into profiles (
  user_id, username, display_name, bio, city, wallet_address, deposit_address,
  role, status, site_url, x_handle, balance, locked_balance
) values
  ('house:platform', 'oriel', 'Agora Gallery', 'Platform reserve.', '', '0xe22fbcc5110e3f22dd3321d89862d4ab7fd5b044', '0xe22fbcc5110e3f22dd3321d89862d4ab7fd5b044', 'treasury', 'active', null, null, 1.250000, 0),
  ('house:adaeze', 'emily', 'Emily Carter', 'Photographs the city after rain. Brooklyn.', 'Brooklyn', '0xac6dc3ba63532777f6c1fa5aa26a9c2571b84c3e', '0xac6dc3ba63532777f6c1fa5aa26a9c2571b84c3e', 'catalog', 'active', 'https://example.com/emily', 'emilycarter', 6.400000, 0),
  ('house:chinedu', 'jason', 'Jason Mitchell', 'Paintings built from three pigments. Austin.', 'Austin', '0x88db0933045fec42b6bc2dd2f46a90add370831a', '0x88db0933045fec42b6bc2dd2f46a90add370831a', 'catalog', 'active', null, 'jasonmitchell', 4.800000, 0),
  ('house:ifeoma', 'olivia', 'Olivia Bennett', 'Cloth woven in her studio in Portland.', 'Portland', '0xe7b22cd704310983ae4ebc8cab6dcebbce9a639b', '0xe7b22cd704310983ae4ebc8cab6dcebbce9a639b', 'catalog', 'active', null, 'oliviabennett', 5.200000, 0),
  ('house:tunde', 'ryan', 'Ryan Cooper', 'Objects, rooms, and the light that finds them. Denver.', 'Denver', '0x983299f2d7b948b2942fee0f4089103275f998f6', '0x983299f2d7b948b2942fee0f4089103275f998f6', 'catalog', 'active', null, 'ryancooper', 3.600000, 0),
  ('house:zainab', 'hannah', 'Hannah Brooks', 'Treats light as a material. San Francisco.', 'San Francisco', '0x348cded8ab292c7594323a7ed227079ccdc22067', '0x348cded8ab292c7594323a7ed227079ccdc22067', 'catalog', 'active', null, 'hannahbrooks', 8.000000, 1.550000),
  ('house:kelechi', 'tyler', 'Tyler Reed', 'Morning yards and ordinary things. Phoenix.', 'Phoenix', '0xf275010fae9544e99d63455ee70e345fb02d8a7d', '0xf275010fae9544e99d63455ee70e345fb02d8a7d', 'catalog', 'active', null, 'tylerreed', 4.100000, 0)
on conflict (user_id) do nothing;

insert into artworks (
  id, token_id, creator_id, owner_id, title, description, category_slug,
  media_kind, image_url, royalty_bps, featured, likes_count, created_at
) values
  (1, 1001, 'house:adaeze', 'house:adaeze', 'Brooklyn Skyline Series',
   'Sodium light on a wet Brooklyn night. Printed from a 35mm frame.',
   'photography', 'image', '/art/rain.jpg', 750, true, 28, now() - interval '20 days'),
  (2, 1002, 'house:adaeze', 'house:adaeze', 'Golden Gate Dreams',
   'Boats at rest, just after the sun leaves the bay.',
   'photography', 'image', '/art/lagoon.jpg', 500, false, 14, now() - interval '16 days'),
  (3, 1003, 'house:chinedu', 'house:chinedu', 'Desert Highway',
   'Impasto in copper, bone, and charcoal. No other pigments.',
   'painting', 'image', '/art/copper.jpg', 1000, true, 41, now() - interval '30 days'),
  (4, 1004, 'house:ifeoma', 'house:ifeoma', 'Hudson River Cloth',
   'A detail of a cloth woven this season in upstate New York.',
   'textile', 'image', '/art/indigo.jpg', 800, false, 19, now() - interval '11 days'),
  (5, 1005, 'house:tunde', 'house:tunde', 'Afternoon in Denver',
   'One shaft of afternoon light in a raw room.',
   'object', 'image', '/art/concrete.jpg', 600, false, 11, now() - interval '9 days'),
  (6, 1006, 'house:tunde', 'house:tunde', 'Fired Clay Vessel',
   'Dark clay, a single copper drip, linen ground.',
   'object', 'image', '/art/vessel.jpg', 500, false, 9, now() - interval '7 days'),
  (7, 1007, 'house:zainab', 'house:zainab', 'Pacific Light',
   'Copper light across a curved plaster wall in San Francisco.',
   'installation', 'image', '/art/frequency.jpg', 800, true, 33, now() - interval '14 days'),
  (8, 1008, 'house:kelechi', 'house:ifeoma', 'First Light in Phoenix',
   'A yard in Phoenix, photographed before the house woke.',
   'photography', 'image', '/art/yard.jpg', 700, false, 22, now() - interval '24 days')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('artworks', 'id'), (select max(id) from artworks));

insert into listings (id, artwork_id, seller_id, kind, price, ends_at, status, created_at) values
  (1, 1, 'house:adaeze', 'fixed', 1.150000, null, 'active', now() - interval '4 days'),
  (2, 2, 'house:adaeze', 'auction', 0.800000, now() + interval '30 hours', 'active', now() - interval '1 day'),
  (3, 3, 'house:chinedu', 'fixed', 2.400000, null, 'active', now() - interval '6 days'),
  (4, 4, 'house:ifeoma', 'fixed', 0.620000, null, 'active', now() - interval '2 days'),
  (5, 5, 'house:tunde', 'auction', 1.400000, now() + interval '6 hours', 'active', now() - interval '10 hours'),
  (6, 6, 'house:tunde', 'fixed', 0.900000, null, 'active', now() - interval '3 days'),
  (7, 7, 'house:zainab', 'fixed', 3.600000, null, 'active', now() - interval '5 days'),
  (8, 8, 'house:ifeoma', 'fixed', 1.350000, null, 'active', now() - interval '2 days')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('listings', 'id'), (select max(id) from listings));

insert into bids (id, listing_id, bidder_id, amount, status, created_at) values
  (1, 5, 'house:zainab', 1.550000, 'leading', now() - interval '2 hours')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('bids', 'id'), (select max(id) from bids));

insert into transactions (
  artwork_id, buyer_id, seller_id, price, royalty_amount, platform_fee, seller_proceeds, kind, created_at, note
) values (
  8, 'house:ifeoma', 'house:kelechi', 0.950000, 0, 0.023750, 0.926250, 'sale',
  now() - interval '12 days', 'Primary sale'
);

update settings set
  platform_fee_bps = 250,
  mint_fee = 0.200000,
  min_withdrawal = 0.050000,
  confirmations_required = 12,
  auto_approve_under = 0,
  hot_wallet_balance = 25,
  hot_wallet_alert = 5,
  network_fee = 0.002000,
  featured_title = 'First Light'
where id = 1;
