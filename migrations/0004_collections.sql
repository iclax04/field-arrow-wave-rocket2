create table if not exists collections (
  id serial primary key,
  slug text unique not null,
  name text not null,
  blurb text not null default '',
  sort int not null default 0
);

create table if not exists collection_artworks (
  collection_id int not null references collections (id) on delete cascade,
  artwork_id int not null references artworks (id) on delete cascade,
  position int not null default 0,
  primary key (collection_id, artwork_id)
);

insert into collections (slug, name, blurb, sort) values
  ('first-light', 'Brooklyn Skyline Series', 'Paintings and photographs of the New York waterfront.', 1),
  ('after-rain', 'Golden Gate Dreams', 'Light, cloth, and the California coast.', 2)
on conflict (slug) do nothing;

insert into collection_artworks (collection_id, artwork_id, position)
select c.id, v.artwork_id, v.position
from collections c
join (
  values
    ('first-light', 3, 1),
    ('first-light', 1, 2),
    ('first-light', 7, 3),
    ('after-rain', 1, 1),
    ('after-rain', 2, 2),
    ('after-rain', 8, 3)
) as v(slug, artwork_id, position) on v.slug = c.slug
on conflict do nothing;
