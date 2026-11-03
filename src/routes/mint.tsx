import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useMarket } from "@/components/market/provider";
import { RequireVerified } from "@/components/market/require-verified";
import { fileToCover, fileToMedia } from "@/lib/files";
import { available, errMsg, formatEth } from "@/lib/format";
import { getCatalog, mintWork } from "@/lib/market.functions";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/mint")({ component: MintPage });

function MintPage() {
  const { user, isPending } = useCurrentUserState();
  const { me, refresh } = useMarket();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [royalty, setRoyalty] = useState(5);
  const [mediaKind, setMediaKind] = useState<"image" | "video" | "audio">("image");
  const [imageData, setImageData] = useState("");
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [listKind, setListKind] = useState<"none" | "fixed" | "auction">("none");
  const [price, setPrice] = useState("");
  const [hours, setHours] = useState("48");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCatalog({ data: {} })
      .then((value) => {
        setCategories(value.categories);
        setCategory((current) => current || value.categories[0]?.slug || "");
      })
      .catch(() => undefined);
  }, []);

  if (isPending) return <p className="px-4 py-16 text-muted">Checking your session…</p>;
  if (!user) return <RedirectToSignIn />;
  if (me?.emailVerified === false) return <RequireVerified />;

  const fee = Number(me?.mintFee ?? 0.2);
  const avail = me ? available(me.profile.balance, me.profile.locked_balance) : 0;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!imageData) {
      toast.error("Add a cover image.");
      return;
    }
    setBusy(true);
    try {
      const result = await mintWork({
        data: {
          title,
          description,
          category,
          royaltyPct: royalty,
          mediaKind,
          imageData,
          mediaData,
          listKind,
          price: listKind === "none" ? null : Number(price),
          endsInHours: Number(hours),
        },
      });
      toast.success(`Minted #${result.tokenId}`);
      refresh();
      void navigate({ to: "/art/$id", params: { id: String(result.id) } });
    } catch (caught) {
      toast.error(errMsg(caught));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-12">
      <form onSubmit={onSubmit} className="space-y-4 md:col-span-7">
        <p className="kicker">Mint</p>
        <h1 className="font-serif text-4xl">Put a work on the floor</h1>
        <p className="text-muted">
          Minting costs {formatEth(fee)}, taken from your available balance before the work is recorded.
          {avail < fee ? (
            <> Not enough yet. <Link to="/deposit" className="text-fg underline">Deposit ETH</Link>.</>
          ) : null}
        </p>
        <label className="block">
          <span className="label">Title</span>
          <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label className="block">
          <span className="label">Description</span>
          <textarea className="field min-h-28 py-3" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Category</span>
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">Royalty {royalty}%</span>
          <input type="range" min={0} max={10} step={0.5} value={royalty} onChange={(event) => setRoyalty(Number(event.target.value))} className="w-full" />
        </label>
        <label className="block">
          <span className="label">Medium</span>
          <select className="field" value={mediaKind} onChange={(event) => setMediaKind(event.target.value as typeof mediaKind)}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Cover image</span>
          <input className="field py-2" type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            fileToCover(file).then(setImageData).catch((caught) => toast.error(errMsg(caught)));
          }} />
        </label>
        {mediaKind !== "image" ? (
          <label className="block">
            <span className="label">{mediaKind === "video" ? "Video" : "Audio"} file</span>
            <input className="field py-2" type="file" accept={mediaKind === "video" ? "video/mp4,video/webm" : "audio/*"} onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              fileToMedia(file, mediaKind).then(setMediaData).catch((caught) => toast.error(errMsg(caught)));
            }} />
          </label>
        ) : null}
        <label className="block">
          <span className="label">Listing</span>
          <select className="field" value={listKind} onChange={(event) => setListKind(event.target.value as typeof listKind)}>
            <option value="none">Do not list yet</option>
            <option value="fixed">Fixed price</option>
            <option value="auction">Timed auction</option>
          </select>
        </label>
        {listKind !== "none" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label">{listKind === "auction" ? "Start price" : "Price"} ETH</span>
              <input className="field" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} required />
            </label>
            {listKind === "auction" ? (
              <label>
                <span className="label">Hours</span>
                <input className="field" inputMode="numeric" value={hours} onChange={(event) => setHours(event.target.value)} />
              </label>
            ) : null}
          </div>
        ) : null}
        <button className="btn" type="submit" disabled={busy || avail < fee}>
          {busy ? "Minting…" : `Mint for ${formatEth(fee)}`}
        </button>
      </form>
      <aside className="md:col-span-5">
        <div className="overflow-hidden rounded-2xl bg-raised">
          {imageData ? <img src={imageData} alt="" className="aspect-[3/4] w-full object-cover" /> : <div className="aspect-[3/4] bg-surface" />}
        </div>
        <h2 className="mt-3 font-serif text-2xl">{title || "Untitled"}</h2>
        <p className="text-sm text-muted">{me?.profile.display_name}</p>
      </aside>
    </div>
  );
}
