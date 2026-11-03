import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { errMsg, formatEth } from "@/lib/format";
import { getHome } from "@/lib/market.functions";

export const Route = createFileRoute("/artists")({ component: ArtistsPage });

function ArtistsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getHome>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getHome()
      .then((value) => {
        if (live) setData(value);
      })
      .catch((caught) => {
        if (live) setError(errMsg(caught));
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl">Artists</h1>
      <p className="mt-2 text-muted">Studios on Agora, ordered by sales.</p>
      {error ? <p className="mt-4 text-danger">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.artists.map((artist) => (
          <Link key={artist.username} to="/artist/$slug" params={{ slug: artist.username }} className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)]">
            <p className="text-xl font-bold">{artist.display_name}</p>
            <p className="mt-1 text-sm text-muted">@{artist.username} · {artist.city || "Studio"}</p>
            <p className="mt-3 line-clamp-3 text-sm">{artist.bio}</p>
            <p className="mt-4 text-sm font-semibold text-accent">{artist.works} works · {formatEth(artist.volume)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
