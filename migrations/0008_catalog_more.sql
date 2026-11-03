insert into profiles (
  user_id, username, display_name, bio, city, wallet_address, deposit_address,
  role, status, site_url, x_handle, balance, locked_balance
) values
  ('house:megan', 'megan', 'Megan Foster', 'Coastal photographs from Seattle.', 'Seattle', '0x1111111111111111111111111111111111110001', '0x1111111111111111111111111111111111110001', 'catalog', 'active', null, 'meganfoster', 3.2, 0),
  ('house:brandon', 'brandon', 'Brandon Hayes', 'City paintings. Chicago.', 'Chicago', '0x1111111111111111111111111111111111110002', '0x1111111111111111111111111111111111110002', 'catalog', 'active', null, 'brandonhayes', 2.4, 0),
  ('house:natalie', 'natalie', 'Natalie Price', 'Studio cloth. Boston.', 'Boston', '0x1111111111111111111111111111111111110003', '0x1111111111111111111111111111111111110003', 'catalog', 'active', null, 'natalieprice', 4.1, 0),
  ('house:caleb', 'caleb', 'Caleb Ward', 'Music Row studies. Nashville.', 'Nashville', '0x1111111111111111111111111111111111110004', '0x1111111111111111111111111111111111110004', 'catalog', 'active', null, 'calebward', 1.8, 0),
  ('house:sophia', 'sophia', 'Sophia Lane', 'Light on the water. Miami.', 'Miami', '0x1111111111111111111111111111111111110005', '0x1111111111111111111111111111111111110005', 'catalog', 'active', null, 'sophialane', 5.0, 0),
  ('house:ethan', 'ethan', 'Ethan Cole', 'Evening streets. Dallas.', 'Dallas', '0x1111111111111111111111111111111111110006', '0x1111111111111111111111111111111111110006', 'catalog', 'active', null, 'ethancole', 2.2, 0),
  ('house:grace', 'grace', 'Grace Sullivan', 'River light. Minneapolis.', 'Minneapolis', '0x1111111111111111111111111111111111110007', '0x1111111111111111111111111111111111110007', 'catalog', 'active', null, 'gracesullivan', 3.6, 0),
  ('house:noah', 'noah', 'Noah Parker', 'Pier photographs. San Diego.', 'San Diego', '0x1111111111111111111111111111111111110008', '0x1111111111111111111111111111111111110008', 'catalog', 'active', null, 'noahparker', 2.9, 0),
  ('house:lily', 'lily', 'Lily Morgan', 'Peachtree afternoons. Atlanta.', 'Atlanta', '0x1111111111111111111111111111111111110009', '0x1111111111111111111111111111111111110009', 'catalog', 'active', null, 'lilymorgan', 1.7, 0)
on conflict (user_id) do nothing;

insert into artworks (
  id, token_id, creator_id, owner_id, title, description, category_slug,
  media_kind, image_url, royalty_bps, featured, likes_count, created_at
) values
  (9, 1009, 'house:megan', 'house:megan', 'Harbor Island', 'A Seattle ferry just after dawn.', 'photography', 'image', '/art/lagoon.jpg', 600, false, 12, now() - interval '3 days'),
  (10, 1010, 'house:brandon', 'house:brandon', 'Lake Shore Drive', 'Three pigments, one Chicago evening.', 'painting', 'image', '/art/copper.jpg', 800, true, 18, now() - interval '4 days'),
  (11, 1011, 'house:natalie', 'house:natalie', 'Beacon Hill Cloth', 'Woven this spring in Boston.', 'textile', 'image', '/art/indigo.jpg', 700, false, 9, now() - interval '5 days'),
  (12, 1012, 'house:caleb', 'house:caleb', 'Music Row', 'A quiet room off the strip.', 'object', 'image', '/art/concrete.jpg', 500, false, 7, now() - interval '6 days'),
  (13, 1013, 'house:sophia', 'house:sophia', 'South Beach Light', 'Color on the water at noon.', 'installation', 'image', '/art/frequency.jpg', 750, true, 21, now() - interval '2 days'),
  (14, 1014, 'house:ethan', 'house:ethan', 'Dallas Dusk', 'Sodium light on a wide street.', 'photography', 'image', '/art/rain.jpg', 650, false, 11, now() - interval '8 days'),
  (15, 1015, 'house:grace', 'house:grace', 'Stone Arch', 'The river under the old bridge.', 'photography', 'image', '/art/yard.jpg', 600, false, 8, now() - interval '9 days'),
  (16, 1016, 'house:noah', 'house:noah', 'Pacific Pier', 'Boats tied up in San Diego.', 'photography', 'image', '/art/lagoon.jpg', 700, true, 16, now() - interval '1 day'),
  (17, 1017, 'house:lily', 'house:lily', 'Peachtree Noon', 'Shade on a downtown sidewalk.', 'painting', 'image', '/art/copper.jpg', 800, false, 10, now() - interval '10 days'),
  (18, 1018, 'house:adaeze', 'house:adaeze', 'Capitol Reflecting', 'The pool, just before closing.', 'photography', 'image', '/art/rain.jpg', 500, false, 14, now() - interval '12 days'),
  (19, 1019, 'house:chinedu', 'house:chinedu', 'Redwood Path', 'A narrow trail in late light.', 'painting', 'image', '/art/vessel.jpg', 900, true, 19, now() - interval '13 days'),
  (20, 1020, 'house:ifeoma', 'house:ifeoma', 'Willamette Bridge', 'Cloth study from a Portland walk.', 'textile', 'image', '/art/indigo.jpg', 650, false, 6, now() - interval '15 days'),
  (21, 1021, 'house:tunde', 'house:tunde', 'Mesa at Dusk', 'One room, one window, Denver.', 'object', 'image', '/art/concrete.jpg', 550, false, 5, now() - interval '18 days'),
  (22, 1022, 'house:zainab', 'house:zainab', 'Chesapeake Wind', 'Light across a curved wall.', 'installation', 'image', '/art/frequency.jpg', 800, false, 13, now() - interval '17 days'),
  (23, 1023, 'house:kelechi', 'house:kelechi', 'Route 66 Noon', 'An empty stretch outside Phoenix.', 'photography', 'image', '/art/yard.jpg', 700, true, 17, now() - interval '19 days'),
  (24, 1024, 'house:megan', 'house:brandon', 'Elm Street Studio', 'A shared studio wall in Chicago.', 'painting', 'image', '/art/copper.jpg', 600, false, 4, now() - interval '21 days'),
  (25, 1025, 'house:brandon', 'house:natalie', 'Adirondack Pine', 'A cabin table, painted from memory.', 'painting', 'image', '/art/vessel.jpg', 750, false, 9, now() - interval '22 days'),
  (26, 1026, 'house:sophia', 'house:sophia', 'French Quarter Shade', 'Afternoon color under a balcony.', 'photography', 'image', '/art/rain.jpg', 650, false, 12, now() - interval '6 days'),
  (27, 1027, 'house:ethan', 'house:grace', 'Blue Ridge Mile', 'One mile of ridge road.', 'photography', 'image', '/art/lagoon.jpg', 500, false, 8, now() - interval '11 days'),
  (28, 1028, 'house:noah', 'house:lily', 'Great Salt Flat', 'White ground, thin blue sky.', 'installation', 'image', '/art/frequency.jpg', 900, true, 20, now() - interval '7 days'),
  (29, 1029, 'house:caleb', 'house:caleb', 'Capitol Steps', 'A quiet hour on the hill.', 'object', 'image', '/art/concrete.jpg', 600, false, 7, now() - interval '14 days'),
  (30, 1030, 'house:grace', 'house:megan', 'Hudson Ferry', 'The last boat of the evening.', 'photography', 'image', '/art/lagoon.jpg', 700, false, 15, now() - interval '16 days')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('artworks', 'id'), (select max(id) from artworks));

insert into listings (id, artwork_id, seller_id, kind, price, ends_at, status, created_at) values
  (9, 9, 'house:megan', 'fixed', 0.850000, null, 'active', now() - interval '1 day'),
  (10, 10, 'house:brandon', 'fixed', 1.600000, null, 'active', now() - interval '2 days'),
  (11, 11, 'house:natalie', 'fixed', 0.720000, null, 'active', now() - interval '2 days'),
  (12, 12, 'house:caleb', 'fixed', 0.540000, null, 'active', now() - interval '3 days'),
  (13, 13, 'house:sophia', 'auction', 1.200000, now() + interval '20 hours', 'active', now() - interval '1 day'),
  (14, 14, 'house:ethan', 'fixed', 0.980000, null, 'active', now() - interval '4 days'),
  (15, 15, 'house:grace', 'fixed', 0.660000, null, 'active', now() - interval '4 days'),
  (16, 16, 'house:noah', 'fixed', 1.450000, null, 'active', now() - interval '1 day'),
  (17, 17, 'house:lily', 'fixed', 1.100000, null, 'active', now() - interval '5 days'),
  (18, 18, 'house:adaeze', 'fixed', 1.250000, null, 'active', now() - interval '6 days'),
  (19, 19, 'house:chinedu', 'fixed', 2.100000, null, 'active', now() - interval '6 days'),
  (20, 20, 'house:ifeoma', 'fixed', 0.810000, null, 'active', now() - interval '7 days'),
  (21, 21, 'house:tunde', 'fixed', 0.930000, null, 'active', now() - interval '7 days'),
  (22, 22, 'house:zainab', 'fixed', 2.800000, null, 'active', now() - interval '8 days'),
  (23, 23, 'house:kelechi', 'fixed', 1.050000, null, 'active', now() - interval '8 days'),
  (24, 24, 'house:brandon', 'fixed', 0.770000, null, 'active', now() - interval '9 days'),
  (25, 25, 'house:natalie', 'fixed', 1.330000, null, 'active', now() - interval '9 days'),
  (26, 26, 'house:sophia', 'fixed', 0.690000, null, 'active', now() - interval '3 days'),
  (27, 27, 'house:grace', 'fixed', 0.880000, null, 'active', now() - interval '5 days'),
  (28, 28, 'house:lily', 'fixed', 3.100000, null, 'active', now() - interval '2 days'),
  (29, 29, 'house:caleb', 'fixed', 0.610000, null, 'active', now() - interval '6 days'),
  (30, 30, 'house:megan', 'fixed', 1.180000, null, 'active', now() - interval '4 days')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('listings', 'id'), (select max(id) from listings));
