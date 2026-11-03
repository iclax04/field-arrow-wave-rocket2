update profiles set
  username = 'emily',
  display_name = 'Emily Carter',
  bio = 'Photographs the city after rain. Brooklyn.',
  city = 'Brooklyn',
  site_url = 'https://example.com/emily',
  x_handle = 'emilycarter'
where user_id = 'house:adaeze';

update profiles set
  username = 'jason',
  display_name = 'Jason Mitchell',
  bio = 'Paintings built from three pigments. Austin.',
  city = 'Austin',
  x_handle = 'jasonmitchell'
where user_id = 'house:chinedu';

update profiles set
  username = 'olivia',
  display_name = 'Olivia Bennett',
  bio = 'Cloth woven in her studio in Portland.',
  city = 'Portland',
  x_handle = 'oliviabennett'
where user_id = 'house:ifeoma';

update profiles set
  username = 'ryan',
  display_name = 'Ryan Cooper',
  bio = 'Objects, rooms, and the light that finds them. Denver.',
  city = 'Denver',
  x_handle = 'ryancooper'
where user_id = 'house:tunde';

update profiles set
  username = 'hannah',
  display_name = 'Hannah Brooks',
  bio = 'Treats light as a material. San Francisco.',
  city = 'San Francisco',
  x_handle = 'hannahbrooks'
where user_id = 'house:zainab';

update profiles set
  username = 'tyler',
  display_name = 'Tyler Reed',
  bio = 'Morning yards and ordinary things. Phoenix.',
  city = 'Phoenix',
  x_handle = 'tylerreed'
where user_id = 'house:kelechi';

update profiles set display_name = 'Agora Gallery', bio = 'Platform reserve.' where user_id = 'house:platform';

update artworks set title = 'Brooklyn Skyline Series', description = 'Sodium light on a wet Brooklyn night. Printed from a 35mm frame.' where id = 1;
update artworks set title = 'Golden Gate Dreams', description = 'Boats at rest, just after the sun leaves the bay.' where id = 2;
update artworks set title = 'Desert Highway', description = 'Impasto in copper, bone, and charcoal. No other pigments.' where id = 3;
update artworks set title = 'Hudson River Cloth', description = 'A detail of a cloth woven this season in upstate New York.' where id = 4;
update artworks set title = 'Afternoon in Denver', description = 'One shaft of afternoon light in a raw room.' where id = 5;
update artworks set title = 'Fired Clay Vessel', description = 'Dark clay, a single copper drip, linen ground.' where id = 6;
update artworks set title = 'Pacific Light', description = 'Copper light across a curved plaster wall in San Francisco.' where id = 7;
update artworks set title = 'First Light in Phoenix', description = 'A yard in Phoenix, photographed before the house woke.' where id = 8;

update collections set name = 'Brooklyn Skyline Series', blurb = 'Paintings and photographs of the New York waterfront.' where slug = 'first-light';
update collections set name = 'Golden Gate Dreams', blurb = 'Light, cloth, and the California coast.' where slug = 'after-rain';

create table if not exists email_codes (
  id serial primary key,
  email text not null,
  code_hash text not null,
  salt text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  locked boolean not null default false,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists email_codes_email_idx on email_codes (email, created_at desc);
