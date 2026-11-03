import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloorCard, WorkGrid } from "@/components/market/cards";
import { errMsg } from "@/lib/format";
import { getCatalog, type Card } from "@/lib/market.functions";

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    category: typeof search.category === "string" ? search.category : "",
    kind: search.kind === "fixed" || search.kind === "auction" ? search.kind : ("" as const),
    min: typeof search.min === "string" ? search.min : "",
    max: typeof search.max === "string" ? search.max : "",
    sort:
      search.sort === "price_asc" || search.sort === "price_desc" || search.sort === "ending"
        ? search.sort
        : ("newest" as const),
    artist: typeof search.artist === "string" ? search.artist : "",
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [works, setWorks] = useState<Card[] | null>(null);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getCatalog({ data: search })
      .then((value) => {
        if (!live) return;
        setWorks(value.works);
        setCategories(value.categories);
      })
      .catch((caught) => {
        if (live) setError(errMsg(caught));
      });
    return () => {
      live = false;
    };
  }, [search]);

  function set<K extends keyof typeof search>(key: K, value: (typeof search)[K]) {
    void navigate({ search: { ...search, [key]: value } });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">The floor</p>
      <h1 className="mt-2 font-serif text-4xl">Find a work</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
        <label className="col-span-2">
          <span className="label">Search</span>
          <input className="field" value={search.q} onChange={(event) => set("q", event.target.value)} />
        </label>
        <label>
          <span className="label">Artist</span>
          <input className="field" value={search.artist} onChange={(event) => set("artist", event.target.value)} />
        </label>
        <label>
          <span className="label">Category</span>
          <select className="field" value={search.category} onChange={(event) => set("category", event.target.value)}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Sale</span>
          <select className="field" value={search.kind} onChange={(event) => set("kind", event.target.value as typeof search.kind)}>
            <option value="">Any</option>
            <option value="fixed">Buy now</option>
            <option value="auction">Auction</option>
          </select>
        </label>
        <label>
          <span className="label">Sort</span>
          <select className="field" value={search.sort} onChange={(event) => set("sort", event.target.value as typeof search.sort)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price up</option>
            <option value="price_desc">Price down</option>
            <option value="ending">Ending soon</option>
          </select>
        </label>
        <label>
          <span className="label">Min ETH</span>
          <input className="field" inputMode="decimal" value={search.min} onChange={(event) => set("min", event.target.value)} />
        </label>
        <label>
          <span className="label">Max ETH</span>
          <input className="field" inputMode="decimal" value={search.max} onChange={(event) => set("max", event.target.value)} />
        </label>
      </div>
      {error ? <p className="mt-6 text-danger">{error}</p> : null}
      <div className="mt-8">
        {works ? (
          works.length ? (
            <WorkGrid>
              {works.map((work) => (
                <FloorCard key={work.id} work={work} />
              ))}
            </WorkGrid>
          ) : (
            <p className="text-muted">Nothing matches those filters.</p>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-raised" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
