import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/market/cards";
import { useMarket } from "@/components/market/provider";
import { available, errMsg, formatEth, formatWhen, royaltyLabel } from "@/lib/format";
import {
  acceptOffer,
  buyListing,
  cancelMyListing,
  getArtwork,
  getWorkOffers,
  listWork,
  makeOffer,
  placeBid,
  rejectOffer,
} from "@/lib/market.functions";

export const Route = createFileRoute("/art/$id")({ component: ArtPage });

function ArtPage() {
  const { id } = Route.useParams();
  const { me, refresh } = useMarket();
  const [pack, setPack] = useState<Awaited<ReturnType<typeof getArtwork>> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bid, setBid] = useState("");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [kind, setKind] = useState<"fixed" | "auction">("fixed");
  const [hours, setHours] = useState("24");
  const [offers, setOffers] = useState<{ id: number; amount: string; bidder_name: string }[]>([]);

  function load() {
    getArtwork({ data: Number(id) })
      .then((value) => {
        setPack(value);
        setError(null);
      })
      .catch((caught) => setError(errMsg(caught)));
  }

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    const artwork = pack?.work;
    if (!me || !artwork || me.profile.user_id !== artwork.owner_id) {
      setOffers([]);
      return;
    }
    getWorkOffers({ data: artwork.id }).then(setOffers).catch(() => setOffers([]));
  }, [me?.profile.user_id, pack?.work?.id, pack?.work?.owner_id]);

  useEffect(() => {
    const artwork = pack?.work;
    if (!me || !artwork) return;
    if (sessionStorage.getItem("agora-buy") !== String(artwork.id)) return;
    sessionStorage.removeItem("agora-buy");
    if (artwork.listing_kind === "fixed" && artwork.listing_id && me.profile.user_id !== artwork.owner_id) {
      setConfirm(true);
    }
  }, [me, pack?.work?.id]);

  const work = pack?.work ?? null;
  const mine = Boolean(work && me && me.profile.user_id === work.owner_id);

  async function run(action: () => Promise<unknown>, done: string) {
    setBusy(true);
    try {
      await action();
      toast.success(done);
      setConfirm(false);
      refresh();
      load();
      if (me) getWorkOffers({ data: Number(id) }).then(setOffers).catch(() => undefined);
    } catch (caught) {
      toast.error(errMsg(caught));
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="mx-auto max-w-6xl px-4 py-16 text-danger">{error}</p>;
  if (pack === undefined) return <div className="mx-auto max-w-6xl px-4 py-8"><div className="aspect-[3/4] max-w-xl animate-pulse rounded-2xl bg-raised" /></div>;
  if (!work) return <p className="mx-auto max-w-6xl px-4 py-16">This work is not on the floor.</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-12">
      <div className="md:col-span-7">
        {work.media_kind === "video" && work.media_url ? (
          <video src={work.media_url} poster={work.image_url} controls className="w-full rounded-2xl bg-ink" />
        ) : (
          <img src={work.image_url} alt={work.title} className="w-full rounded-2xl object-cover" />
        )}
        {work.media_kind === "audio" && work.media_url ? <audio src={work.media_url} controls className="mt-4 w-full" /> : null}
      </div>
      <div className="md:col-span-5">
        <p className="kicker">#{work.token_id} · {work.category_slug}</p>
        <h1 className="mt-2 font-serif text-4xl">{work.title}</h1>
        <p className="mt-3 text-muted">{work.description}</p>
        <dl className="mt-6 space-y-2 text-sm">
          <Row label="Artist">
            <Link to="/artist/$slug" params={{ slug: work.creator_username }} className="underline">{work.creator_name}</Link>
          </Row>
          <Row label="Holder">
            <Link to="/artist/$slug" params={{ slug: work.owner_username }} className="underline">{work.owner_name}</Link>
          </Row>
          <Row label="Royalty">{royaltyLabel(work.royalty_bps)} on resale</Row>
          <Row label="Saved">{work.likes_count}</Row>
        </dl>

        <div className="mt-6 rounded-2xl bg-surface p-4">
          {work.listing_kind === "fixed" && work.price ? (
            <>
              <p className="kicker">Buy now</p>
              <p className="mt-1 font-serif text-4xl tabular-nums">{formatEth(work.price)}</p>
              {!mine ? (
                me ? (
                  <button type="button" className="btn mt-4 w-full" onClick={() => setConfirm(true)}>Buy</button>
                ) : (
                  <Link
                    to="/login"
                    search={{ mode: "in" }}
                    className="btn mt-4 w-full"
                    onClick={() => {
                      sessionStorage.setItem("agora-next", `/art/${work.id}`);
                      sessionStorage.setItem("agora-buy", String(work.id));
                    }}
                  >
                    Buy
                  </Link>
                )
              ) : null}
            </>
          ) : null}
          {work.listing_kind === "auction" ? (
            <>
              <p className="kicker">Auction</p>
              <p className="mt-1 font-serif text-4xl tabular-nums">{formatEth(work.high_bid || work.price)}</p>
              <Countdown ends={work.ends_at} />
              {!mine && me ? (
                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!work.listing_id) return;
                    void run(() => placeBid({ data: { listingId: work.listing_id, amount: Number(bid) } }), "Bid placed");
                  }}
                >
                  <input className="field" inputMode="decimal" placeholder="Your bid" value={bid} onChange={(event) => setBid(event.target.value)} required />
                  <button className="btn" type="submit" disabled={busy}>Bid</button>
                </form>
              ) : null}
            </>
          ) : null}
          {!work.listing_id ? <p className="text-muted">Not listed.</p> : null}
          {!me && work.listing_kind !== "fixed" ? <Link to="/login" search={{ mode: "in" }} className="btn mt-4 w-full">Sign in to collect</Link> : null}
          {mine && work.listing_id ? (
            <button type="button" className="btn-ghost mt-4 w-full" disabled={busy} onClick={() => void run(() => cancelMyListing({ data: work.listing_id as number }), "Listing cancelled")}>
              Cancel listing
            </button>
          ) : null}
        </div>

        {!mine && me ? (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              void run(() => makeOffer({ data: { artworkId: work.id, amount: Number(offer) } }), "Offer made");
            }}
          >
            <input className="field" inputMode="decimal" placeholder="Make an offer" value={offer} onChange={(event) => setOffer(event.target.value)} required />
            <button className="btn-ghost" type="submit" disabled={busy}>Offer</button>
          </form>
        ) : null}

        {mine && !work.listing_id ? (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void run(
                () => listWork({ data: { artworkId: work.id, kind, price: Number(price), endsInHours: Number(hours) } }),
                "Listed",
              );
            }}
          >
            <p className="kicker">List this work</p>
            <div className="flex gap-2">
              <select className="field" value={kind} onChange={(event) => setKind(event.target.value as "fixed" | "auction")}>
                <option value="fixed">Fixed price</option>
                <option value="auction">Timed auction</option>
              </select>
              <input className="field" inputMode="decimal" placeholder="ETH" value={price} onChange={(event) => setPrice(event.target.value)} required />
            </div>
            {kind === "auction" ? (
              <label className="block">
                <span className="label">Hours</span>
                <input className="field" inputMode="numeric" value={hours} onChange={(event) => setHours(event.target.value)} />
              </label>
            ) : null}
            <button className="btn w-full" type="submit" disabled={busy}>List</button>
          </form>
        ) : null}

        {mine && offers.length > 0 ? (
          <section className="mt-4 space-y-3">
            <p className="kicker">Offers on this work</p>
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-2xl bg-surface p-4">
                <p>{offer.bidder_name} offered {formatEth(offer.amount)}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn" disabled={busy} onClick={() => void run(() => acceptOffer({ data: offer.id }), "Offer accepted")}>Accept</button>
                  <button type="button" className="btn-ghost" disabled={busy} onClick={() => void run(() => rejectOffer({ data: offer.id }), "Offer declined")}>Decline</button>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="font-serif text-2xl">Price history</h2>
          {pack && pack.history.length ? (
            <>
              <div className="mt-4 flex h-24 items-end gap-2">
                {pack.history.map((row) => {
                  const max = Math.max(...pack.history.map((item) => Number(item.price)));
                  const height = max > 0 ? Math.max(12, (Number(row.price) / max) * 100) : 12;
                  return (
                    <div key={row.id} className="flex h-full flex-1 items-end" title={formatEth(row.price)}>
                      <div className="w-full rounded-t-lg bg-accent" style={{ height: `${height}%` }} />
                    </div>
                  );
                })}
              </div>
              <ul className="mt-3 divide-y divide-line text-sm">
                {pack.history.map((row) => (
                  <li key={row.id} className="flex justify-between gap-3 py-2">
                    <span>{row.kind} · {row.buyer_name}</span>
                    <span className="tabular-nums">{formatEth(row.price)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">No sales yet. The first hand is still the artist’s.</p>
          )}
          {pack && pack.offerCount > 0 ? (
            <p className="mt-3 text-sm text-muted">{pack.offerCount} open offer{pack.offerCount === 1 ? "" : "s"}{pack.topOffer ? `, top ${formatEth(pack.topOffer)}` : ""}.</p>
          ) : null}
        </section>
      </div>
      {confirm && work.price ? (
        <Modal title="Confirm purchase" onClose={() => setConfirm(false)}>
          <p>Pay {formatEth(work.price)} for {work.title} from your available balance.</p>
          <p className="mt-2 text-sm text-muted">
            Available {me ? formatEth(available(me.profile.balance, me.profile.locked_balance)) : "—"}. The artist royalty and platform fee come out of that price.
          </p>
          <button
            type="button"
            className="btn mt-4 w-full"
            disabled={busy}
            onClick={() => void run(() => buyListing({ data: work.listing_id as number }), "It’s yours")}
          >
            {busy ? "Settling…" : "Confirm"}
          </button>
        </Modal>
      ) : null}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

function Countdown({ ends }: { ends: string | null }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!ends) return;
    const tick = () => {
      const ms = new Date(ends).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("Ended");
        return;
      }
      const s = Math.floor(ms / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      setLabel(`${h}h ${m}m ${s % 60}s left`);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [ends]);
  return <p className="mt-1 text-sm text-muted">{label || (ends ? formatWhen(ends) : "")}</p>;
}
