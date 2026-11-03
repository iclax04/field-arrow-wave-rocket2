import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FloorCard, WorkGrid } from "@/components/market/cards";
import { errMsg, shortAddr } from "@/lib/format";
import { getArtist } from "@/lib/market.functions";

export const Route = createFileRoute("/artist/$slug")({ component: ArtistPage });

function ArtistPage() {
  const { slug } = Route.useParams();
  const [tab, setTab] = useState<"created" | "owned">("created");
  const [data, setData] = useState<Awaited<ReturnType<typeof getArtist>> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getArtist({ data: slug })
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
  if (data === undefined) return <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Loading studio…</div>;
  if (!data) return <p className="mx-auto max-w-6xl px-4 py-16">No studio by that name.</p>;
  const { profile } = data;
  const works = tab === "created" ? data.created : data.owned;
  const initials = profile.display_name.split(" ").slice(0, 2).map((part) => part[0]).join("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start gap-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-raised font-serif text-2xl">{initials}</span>
        )}
        <div>
          <h1 className="font-serif text-4xl">{profile.display_name}</h1>
          <p className="text-muted">@{profile.username}{profile.city ? ` · ${profile.city}` : ""}</p>
          <p className="mt-3 max-w-xl">{profile.bio}</p>
          <p className="mt-2 text-sm text-muted">{shortAddr(profile.wallet_address)}</p>
          <div className="mt-2 flex gap-4 text-sm">
            {profile.x_handle ? <a className="underline" href={`https://x.com/${profile.x_handle}`}>X</a> : null}
            {profile.site_url ? <a className="underline" href={profile.site_url}>Site</a> : null}
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-2">
        <button type="button" className={tab === "created" ? "btn" : "btn-ghost"} onClick={() => setTab("created")}>Created</button>
        <button type="button" className={tab === "owned" ? "btn" : "btn-ghost"} onClick={() => setTab("owned")}>Collected</button>
      </div>
      <div className="mt-6">
        {works.length ? (
          <WorkGrid>{works.map((work) => <FloorCard key={work.id} work={work} />)}</WorkGrid>
        ) : (
          <p className="text-muted">Nothing in this column yet.</p>
        )}
      </div>
    </div>
  );
}
