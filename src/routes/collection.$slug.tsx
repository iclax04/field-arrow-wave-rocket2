import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloorCard, WorkGrid } from "@/components/market/cards";
import { errMsg } from "@/lib/format";
import { getCollection } from "@/lib/market.functions";

export const Route = createFileRoute("/collection/$slug")({ component: CollectionPage });

function CollectionPage() {
  const { slug } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getCollection>> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getCollection({ data: slug })
      .then((value) => {
        if (live) setData(value);
      })
      .catch((caught) => {
        if (live) setError(errMsg(caught));
      });
    return () => {
      live = false;
    };
  }, [slug]);

  if (error) return <p className="mx-auto max-w-6xl px-4 py-16 text-danger">{error}</p>;
  if (data === undefined) return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Opening the room…</div>;
  if (!data) return <p className="mx-auto max-w-6xl px-4 py-16">That collection is not on the floor.</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="kicker">Collection</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{data.name}</h1>
      <p className="mt-3 max-w-xl text-muted">{data.blurb}</p>
      <div className="mt-8">
        {data.works.length ? (
          <WorkGrid>
            {data.works.map((work) => (
              <FloorCard key={work.id} work={work} />
            ))}
          </WorkGrid>
        ) : (
          <p className="text-muted">Nothing is hanging in this room yet.</p>
        )}
      </div>
    </div>
  );
}
