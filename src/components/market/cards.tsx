import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState, type ReactNode } from "react";
import { available, errMsg, formatEth } from "@/lib/format";
import { useMarket } from "./provider";
import { buyListing, toggleFavorite, type Card } from "@/lib/market.functions";

export function BuyButton({ work, className }: { work: Card; className?: string }) {
  const { me, refresh } = useMarket();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mine = Boolean(me && me.profile.user_id === work.owner_id);
  const forSale = work.listing_kind === "fixed" && Boolean(work.price) && Boolean(work.listing_id);
  if (!forSale || mine) return null;
  const look = className ?? "btn mt-2 w-full";

  if (!me) {
    return (
      <Link
        to="/login"
        search={{ mode: "in" }}
        className={look}
        onClick={() => {
          sessionStorage.setItem("agora-next", `/art/${work.id}`);
          sessionStorage.setItem("agora-buy", String(work.id));
        }}
      >
        Buy
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={look}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setError("");
          setOpen(true);
        }}
      >
        Buy
      </button>
      {open ? (
        <Modal title="Confirm purchase" onClose={() => setOpen(false)}>
          <p>Pay {formatEth(work.price)} for {work.title} from your available balance.</p>
          <p className="mt-2 text-sm text-muted">
            Available {formatEth(available(me.profile.balance, me.profile.locked_balance))}. The artist royalty and the platform fee come out of that price.
          </p>
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          <button
            type="button"
            className="btn mt-4 w-full"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              setError("");
              void buyListing({ data: work.listing_id as number })
                .then(() => {
                  setOpen(false);
                  refresh();
                })
                .catch((caught) => setError(errMsg(caught)))
                .finally(() => setBusy(false));
            }}
          >
            {busy ? "Settling…" : "Confirm purchase"}
          </button>
        </Modal>
      ) : null}
    </>
  );
}

export function ArtworkCard({
  work,
  liked,
  onLike,
}: {
  work: Card;
  liked?: boolean;
  onLike?: () => void;
}) {
  const price =
    work.listing_kind === "auction"
      ? work.high_bid
        ? `Bid ${formatEth(work.high_bid)}`
        : `From ${formatEth(work.price)}`
      : work.price
        ? formatEth(work.price)
        : "Unlisted";

  return (
    <article className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow)]">
      <Link to="/art/$id" params={{ id: String(work.id) }} className="block">
        <div className="overflow-hidden rounded-xl bg-raised">
          <img src={work.image_url} alt="" className="aspect-[3/4] w-full object-cover" />
        </div>
        <div className="px-2 pb-2 pt-3">
          <h3 className="truncate text-base">{work.title}</h3>
          <p className="truncate text-sm text-muted">{work.creator_name}</p>
          <p className="mt-2 text-sm font-semibold">{price}</p>
        </div>
      </Link>
      <div className="px-2 pb-2">
        <BuyButton work={work} />
      </div>
      {onLike ? (
        <button
          type="button"
          onClick={onLike}
          aria-label={liked ? `Remove ${work.title} from saved` : `Save ${work.title}`}
          className="ml-2 inline-flex h-11 w-11 items-center justify-center text-muted"
        >
          <Heart size={18} className={liked ? "fill-violet text-violet" : ""} aria-hidden />
        </button>
      ) : null}
    </article>
  );
}

export function FloorCard({ work }: { work: Card }) {
  const { me, refresh } = useMarket();
  const liked = me?.favoriteIds.includes(work.id) ?? false;
  return (
    <ArtworkCard
      work={work}
      liked={liked}
      onLike={
        me
          ? () => {
              void toggleFavorite({ data: work.id }).then(() => refresh());
            }
          : undefined
      }
    />
  );
}
  export function WorkGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-muted">{children}</p>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/70 p-4 sm:place-items-center" role="dialog" aria-modal="true">
      <div className="lift max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-surface p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button type="button" className="btn-ghost px-3" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
