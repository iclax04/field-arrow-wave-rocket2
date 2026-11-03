import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Camera, Frame, Grid2x2, Image, Layers, Shapes } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BuyButton } from "@/components/market/cards";
import { useMarket } from "@/components/market/provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ethUsdRate, errMsg, formatUsd } from "@/lib/format";
import { getHome } from "@/lib/market.functions";

export const Route = createFileRoute("/")({ component: HomePage });

const floor = { q: "", category: "", kind: "", min: "", max: "", sort: "newest" as const, artist: "" };

const ICONS: Record<string, ReactNode> = {
  photography: <Camera size={14} aria-hidden />,
  painting: <Image size={14} aria-hidden />,
  textile: <Layers size={14} aria-hidden />,
  object: <Shapes size={14} aria-hidden />,
  installation: <Frame size={14} aria-hidden />,
};

function HomePage() {
  const { user, isPending } = useCurrentUserState();
  const [data, setData] = useState<Awaited<ReturnType<typeof getHome>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chip, setChip] = useState("all");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [shown, setShown] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { toggleTheme } = useMarket();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) return;
    let live = true;
    let first = true;
    async function pull() {
      try {
        const value = await getHome();
        if (!live) return;
        if (first) {
          setData(value);
          first = false;
          return;
        }
        setShown(false);
        window.setTimeout(() => {
          if (!live) return;
          setData(value);
          setSlide(0);
          setShown(true);
        }, 280);
      } catch (caught) {
        if (live) setError(errMsg(caught));
      }
    }
    void pull();
    const timer = window.setInterval(() => {
      if (!paused) void pull();
    }, 15_000);
    return () => {
      live = false;
      window.clearInterval(timer);
    };
  }, [paused, user]);

  if (!mounted || isPending) {
    return (
      <div className="bg-[#0d0d0f] px-4 py-6">
        <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;

  const slides = (data?.featured.length ? data.featured : data?.floor ?? []).slice(0, 5);
  const current = slides[slide] ?? slides[0];
  const rows = (data?.floor ?? []).filter((work) => chip === "all" || work.category_slug === chip);

  return (
    <div className="bg-[#0d0d0f] pb-8 text-white">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={chip === "all"} onClick={() => setChip("all")} icon={<Grid2x2 size={14} aria-hidden />}>All</Chip>
        {data?.categories.map((category) => (
          <Chip key={category.slug} active={chip === category.slug} onClick={() => setChip(category.slug)} icon={ICONS[category.slug]}>
            {category.name}
          </Chip>
        ))}
      </div>

      {error ? <p className="px-4 text-sm text-red-300">{error}</p> : null}

      <section
        className={`px-4 transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h2 className="text-lg font-bold">Featured artworks</h2>
        {data ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {data.featured.slice(0, 4).map((work) => (
              <article key={work.id} className="overflow-hidden rounded-2xl bg-white/5">
                <Link to="/art/$id" params={{ id: String(work.id) }}>
                  <img src={work.image_url} alt="" className="aspect-[3/4] w-full object-cover" />
                  <span className="block px-3 py-2 text-sm font-semibold">{work.title}</span>
                  <span className="block px-3 text-xs text-white/60">{work.creator_name} · {usd(work.price)}</span>
                </Link>
                <div className="px-3 pb-3">
                  <BuyButton work={work} className="btn mt-2 w-full" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        )}
        <h2 className="mt-8 text-lg font-bold">Trending artists</h2>
        {data ? (
          <div className="mt-3 grid gap-2">
            {data.artists.slice(0, 4).map((artist) => (
              <Link key={artist.username} to="/artist/$slug" params={{ slug: artist.username }} className="rounded-2xl border border-white/10 px-4 py-3">
                <span className="block font-semibold">{artist.display_name}</span>
                <span className="block text-sm text-white/55">{artist.city || "United States"} · {artist.works} works</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        )}
      </section>

      {current ? (
        <section className="px-4">
          <div className="relative overflow-hidden rounded-2xl">
            <Link to="/art/$id" params={{ id: String(current.id) }} className="relative block">
              <img src={current.image_url} alt="" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 pb-20">
                <h1 className="flex items-center gap-2 text-3xl font-bold">
                  {current.title}
                  <Check />
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                  By {current.creator_name}
                  <Check />
                </p>
              </div>
            </Link>
            <Link to="/explore" search={floor} className="btn absolute inset-x-4 bottom-4">Explore artworks</Link>
          </div>
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {slides.map((work, index) => (
              <button
                key={work.id}
                type="button"
                aria-label={`Show ${work.title}`}
                onClick={() => setSlide(index)}
                className={`h-1 rounded-full ${index === slide ? "w-6 bg-white" : "w-4 bg-white/30"}`}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mx-4 aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
      )}

      <div className="mt-5 flex items-center justify-between px-4">
        <p className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">Artworks</p>
        <Link to="/explore" search={{ ...floor, category: chip === "all" ? "" : chip }} className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold">
          Browse
        </Link>
      </div>

      <div className="mt-4 flex px-4 text-[11px] font-semibold tracking-[0.14em] text-white/45">
        <span>COLLECTION</span>
        <span className="ml-auto">FLOOR</span>
      </div>
      <ul className="mt-2">
        {rows.map((work) => (
          <li key={work.id}>
            <Link to="/art/$id" params={{ id: String(work.id) }} className="flex items-center gap-3 px-4 py-2.5">
              <img src={work.image_url} alt="" className="h-11 w-11 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 truncate font-semibold">
                  {work.title}
                  <Check />
                </span>
                <span className="block truncate text-sm text-white/55">{work.creator_name}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold">{usd(work.price)}</span>
                <span className="block text-xs text-white/50">{work.price ? `${Number(work.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETH` : "Unlisted"}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mx-4 mt-6 flex items-center justify-between rounded-full border border-white/10 px-3 py-2 text-sm">
        <span>{formatUsd(ethUsdRate())}</span>
        <button type="button" onClick={toggleTheme} className="rounded-full px-3 py-1 text-white/80" aria-label="Toggle color theme">
          Theme
        </button>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">USD</span>
      </div>
    </div>
  );
}

function Chip({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: ReactNode; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${active ? "bg-white text-black" : "bg-white/10 text-white"}`}
    >
      {icon}
      {children}
    </button>
  );
}

function Check() {
  return (
    <span className="inline-grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent text-[10px] text-white" aria-hidden>
      ✓
    </span>
  );
}

function usd(price: string | null): string {
  if (!price) return "—";
  const n = Number(price);
  if (!Number.isFinite(n)) return "—";
  return formatUsd(n * ethUsdRate());
}
