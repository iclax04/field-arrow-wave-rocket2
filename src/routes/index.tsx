import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Camera, Frame, Grid2x2, Image, Layers, Shapes } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BuyButton } from "@/components/market/cards";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ethUsdRate, errMsg, formatUsd } from "@/lib/format";
import { getHome, type Card } from "@/lib/market.functions";

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
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="aspect-[5/4] animate-pulse rounded-3xl bg-white/10 md:aspect-[2/1]" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
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
    <div
      className={`bg-[#0d0d0f] pb-10 text-white transition-opacity duration-500 md:pb-16 ${shown ? "opacity-100" : "opacity-0"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4">
        {error ? <p className="py-3 text-sm text-red-300">{error}</p> : null}

        {current ? (
          <section className="pt-4">
            <div className="overflow-hidden rounded-3xl md:grid md:min-h-[420px] md:grid-cols-2 md:bg-white/5">
              <Link to="/art/$id" params={{ id: String(current.id) }} className="relative block min-h-0">
                <img src={current.image_url} alt="" className="aspect-[5/4] w-full object-cover md:aspect-auto md:h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent md:hidden" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:hidden">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Featured</p>
                  <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold">{current.title}<Check /></h1>
                  <p className="mt-1 text-sm text-white/80">By {current.creator_name}</p>
                </div>
              </Link>
              <div className="hidden flex-col justify-center p-10 md:flex">
                <p className="text-sm font-semibold text-white/50">Featured</p>
                <h1 className="mt-2 flex items-center gap-2 text-4xl font-bold leading-tight">{current.title}<Check /></h1>
                <p className="mt-3 text-white/70">By {current.creator_name}</p>
                <p className="mt-5 text-2xl font-semibold">{usd(current.price)}</p>
                <p className="mt-2 text-sm text-white/50">{eth(current.price)}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <BuyButton work={current} className="btn" />
                  <Link to="/explore" search={floor} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Explore artworks</Link>
                </div>
              </div>
            </div>
            <div className="mt-3 md:hidden">
              <BuyButton work={current} className="btn w-full" />
              <Link to="/explore" search={floor} className="mt-2 block rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold">Explore artworks</Link>
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {slides.map((work, index) => (
                <button
                  key={work.id}
                  type="button"
                  aria-label={`Show ${work.title}`}
                  onClick={() => setSlide(index)}
                  className={`h-1.5 rounded-full ${index === slide ? "w-6 bg-white" : "w-4 bg-white/30"}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-4 aspect-[5/4] animate-pulse rounded-3xl bg-white/5 md:aspect-[2/1]" />
        )}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <Chip active={chip === "all"} onClick={() => setChip("all")} icon={<Grid2x2 size={14} aria-hidden />}>All</Chip>
          {data?.categories.map((category) => (
            <Chip key={category.slug} active={chip === category.slug} onClick={() => setChip(category.slug)} icon={ICONS[category.slug]}>
              {category.name}
            </Chip>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold md:text-2xl">Featured artworks</h2>
          {data ? (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {data.featured.slice(0, 4).map((work) => (
                <WorkTile key={work.id} work={work} />
              ))}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold md:text-2xl">Trending artists</h2>
          {data ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
              {data.artists.slice(0, 4).map((artist) => (
                <Link
                  key={artist.username}
                  to="/artist/$slug"
                  params={{ slug: artist.username }}
                  className="w-56 shrink-0 rounded-2xl border border-white/10 px-4 py-4 md:w-auto"
                >
                  <span className="block truncate font-semibold">{artist.display_name}</span>
                  <span className="mt-1 block truncate text-sm text-white/55">{artist.city || "United States"} · {artist.works} works</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            ["1", "Create an account", "Verify your email, then open a studio."],
            ["2", "Mint or collect", "List a work, or buy one with your balance."],
            ["3", "Earn royalties", "The artist is paid again on every resale."],
          ].map(([step, title, copy]) => (
            <div key={step} className="rounded-2xl border border-white/10 px-4 py-4">
              <p className="text-sm font-semibold text-white/45">{step}</p>
              <p className="mt-1 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-white/55">{copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold md:text-2xl">Artworks</h2>
            <Link to="/explore" search={{ ...floor, category: chip === "all" ? "" : chip }} className="text-sm font-semibold text-white/70">
              Browse
            </Link>
          </div>

          <ul className="mt-3 md:hidden">
            {rows.map((work) => (
              <li key={work.id} className="flex items-center gap-3 border-t border-white/10 py-3">
                <Link to="/art/$id" params={{ id: String(work.id) }} className="flex min-w-0 flex-1 items-center gap-3">
                  <img src={work.image_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 truncate font-semibold">{work.title}<Check /></span>
                    <span className="block truncate text-sm text-white/55">{work.creator_name}</span>
                    <span className="mt-0.5 block text-sm font-semibold">{usd(work.price)}</span>
                  </span>
                </Link>
                <BuyButton work={work} className="btn shrink-0 px-4 text-sm" />
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden gap-5 md:grid md:grid-cols-3 lg:grid-cols-4">
            {rows.map((work) => (
              <WorkTile key={work.id} work={work} />
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-white/45">Reference rate · 1 ETH ≈ {formatUsd(ethUsdRate())}</p>
      </div>
    </div>
  );
}

function WorkTile({ work }: { work: Card }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white/5">
      <Link to="/art/$id" params={{ id: String(work.id) }}>
        <img src={work.image_url} alt="" className="aspect-[3/4] w-full object-cover" />
        <span className="block truncate px-3 pt-3 text-sm font-semibold">{work.title}</span>
        <span className="block truncate px-3 text-xs text-white/60">{work.creator_name}</span>
        <span className="block px-3 pb-1 text-sm font-semibold">{usd(work.price)}</span>
      </Link>
      <div className="px-3 pb-3">
        <BuyButton work={work} className="btn mt-2 w-full" />
      </div>
    </article>
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

function eth(price: string | null): string {
  if (!price) return "";
  const n = Number(price);
  if (!Number.isFinite(n)) return "";
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETH`;
}
