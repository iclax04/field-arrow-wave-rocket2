import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Camera, Clock3, Frame, Grid2x2, Image, Layers, LayoutGrid, Shapes } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useMarket } from "@/components/market/provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ethUsdRate, errMsg, formatUsd } from "@/lib/format";
import { getHome } from "@/lib/market.functions";

export const Route = createFileRoute("/")({ component: HomePage });

const floorSearch = { q: "", category: "", kind: "", min: "", max: "", sort: "newest" as const, artist: "" };

const ICONS: Record<string, ReactNode> = {
  photography: <Camera size={14} aria-hidden />,
  painting: <Image size={14} aria-hidden />,
  textile: <Layers size={14} aria-hidden />,
  object: <Shapes size={14} aria-hidden />,
  installation: <Frame size={14} aria-hidden />,
};

type Slide = {
  key: string;
  kind: "collection" | "art";
  slug: string;
  image: string;
  title: string;
  by: string;
  floor: string | null;
  items: number;
  volume: string;
};

function HomePage() {
  const { user, isPending } = useCurrentUserState();
  const { setTheme } = useMarket();
  const [data, setData] = useState<Awaited<ReturnType<typeof getHome>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chip, setChip] = useState("all");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panel, setPanel] = useState<"nfts" | "tokens">("nfts");

  useEffect(() => {
    setMounted(true);
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    if (user) return;
    let live = true;
    async function pull() {
      try {
        const value = await getHome();
        if (live) setData(value);
      } catch (caught) {
        if (live) setError(errMsg(caught));
      }
    }
    void pull();
    const timer = window.setInterval(pull, 15_000);
    return () => {
      live = false;
      window.clearInterval(timer);
    };
  }, [user]);

  const slides = buildSlides(data, chip);
  const current = slides[slide] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setSlide((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  useEffect(() => {
    setSlide(0);
  }, [chip]);

  if (!mounted || isPending) {
    return (
      <div className="mx-auto max-w-lg bg-[#0d0d0f] px-3 py-4">
        <div className="h-8 w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-4 aspect-[5/4] animate-pulse rounded-2xl bg-white/10" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;

  const rows = panel === "tokens" ? tokenRows(data) : listRows(data, chip);

  return (
    <div className="min-h-[100dvh] bg-black pb-10 font-sans text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-6xl">
        {error ? <p className="px-3 py-2 text-sm text-red-300">{error}</p> : null}

        <div className="flex gap-2 overflow-x-auto px-3 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={chip === "all"} onClick={() => setChip("all")} icon={<Grid2x2 size={14} aria-hidden />}>All</Chip>
          {data?.categories.map((category) => (
            <Chip key={category.slug} active={chip === category.slug} onClick={() => setChip(category.slug)} icon={ICONS[category.slug]}>
              {category.name}
            </Chip>
          ))}
        </div>

        {current ? (
          <section className="px-3">
            <SlideLink slide={current} className="relative block overflow-hidden rounded-[1.35rem]">
              <img src={current.image} alt="" className="aspect-square w-full object-cover md:aspect-[16/7]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-[5.6rem]">
                <h1 className="flex items-center gap-1.5 text-[1.65rem] font-bold leading-none tracking-[-0.03em]">
                  {current.title}
                  <Check />
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-[15px] text-white/95">
                  By {current.by}
                  <Check />
                </p>
              </div>
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-black/45 px-1 py-3 backdrop-blur-md">
                <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
                  <Stat label="Floor price" value={money(current.floor)} />
                  <Stat label="Items" value={current.items.toLocaleString("en-US")} />
                  <Stat label="Total volume" value={compactUsd(Number(current.volume) * ethUsdRate(), current.volume)} />
                </div>
              </div>
            </SlideLink>
            <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
              {slides.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  onClick={() => setSlide(index)}
                  className={`h-1 rounded-full ${index === slide ? "w-7 bg-white" : "w-6 bg-white/25"}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="mx-3 aspect-[5/4] animate-pulse rounded-[1.35rem] bg-white/10" />
        )}

        <div className="mt-4 flex items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => setPanel("nfts")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-semibold ${panel === "nfts" ? "bg-[#2a2a2e] text-white" : "text-white/75"}`}
          >
            <LayoutGrid size={15} aria-hidden />
            NFTs
          </button>
          <button
            type="button"
            onClick={() => setPanel("tokens")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-semibold ${panel === "tokens" ? "bg-[#2a2a2e] text-white" : "text-white/75"}`}
          >
            <Clock3 size={15} aria-hidden />
            Tokens
          </button>
          <Link
            to="/explore"
            search={{ ...floorSearch, category: chip === "all" ? "" : chip }}
            className="ml-auto rounded-full bg-[#2a2a2e] px-4 py-2 text-[15px] font-semibold"
          >
            Browse
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-between px-4 text-[11px] font-semibold tracking-[0.16em] text-white/40">
          <span>{panel === "tokens" ? "TOKEN" : "COLLECTION"}</span>
          <span>FLOOR</span>
        </div>
        <ul className="md:grid md:grid-cols-2 md:gap-x-6">
          {rows.map((row) => (
            <li key={row.key}>
              <RowLink row={row} className="flex items-center gap-3 px-3 py-2.5">
                <img src={row.image} alt="" className="h-11 w-11 rounded-lg bg-white/10 object-cover" />
                <span className="flex min-w-0 items-center gap-1 font-semibold">
                  <span className="truncate">{row.title}</span>
                  <Check />
                </span>
                <span className="ml-auto shrink-0 text-right">
                  <span className="block text-[15px] font-semibold tabular-nums">{money(row.floor)}</span>
                  <span className={`block text-sm font-semibold tabular-nums ${row.change >= 0 ? "text-[#12b76a]" : "text-[#f04438]"}`}>
                    {row.change >= 0 ? "+" : ""}
                    {row.change.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                  </span>
                </span>
              </RowLink>
            </li>
          ))}
        </ul>

        <Section
          title="Featured collections"
          subtitle="This week's curated collections"
          action={<Link to="/explore" search={floorSearch} className="text-sm font-semibold text-white/70">View all</Link>}
        >
          <div className="flex gap-3 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {(data?.collections ?? []).filter((item) => item.cover).map((item) => (
              <Link key={item.slug} to="/collection/$slug" params={{ slug: item.slug }} className="w-44 shrink-0 md:w-auto">
                <img src={item.cover || ""} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                <span className="mt-2 flex items-center gap-1 text-sm font-semibold">
                  <span className="truncate">{item.name}</span>
                  <Check />
                </span>
                <span className="block text-sm text-white/60">Floor {money(item.floor)}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          title="Featured drops"
          subtitle="This week's curated live and upcoming drops"
          action={<Link to="/explore" search={floorSearch} className="text-sm font-semibold text-white/70">View all</Link>}
        >
          <div className="flex gap-3 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {(data?.featured ?? []).slice(0, 8).map((work) => (
              <Link key={work.id} to="/art/$id" params={{ id: String(work.id) }} className="w-44 shrink-0 md:w-auto">
                <img src={work.image_url} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                <span className="mt-2 block truncate text-sm font-semibold">{work.title}</span>
                <span className="block truncate text-xs text-white/55">{work.creator_name}</span>
                <span className="mt-1 block text-sm font-semibold">{money(work.price)}</span>
              </Link>
            ))}
          </div>
        </Section>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Section title="Top movers today" subtitle="Largest floor price change in the past day">
            <RankList rows={[...listRows(data, chip)].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5)} />
          </Section>
          <Section title="Highest weekly sales" subtitle="Largest sales this week">
            <RankList
              rows={(data?.floor ?? []).slice(0, 5).map((work) => ({
                key: `sale-${work.id}`,
                kind: "art" as const,
                slug: String(work.id),
                image: work.image_url,
                title: work.title,
                floor: work.price,
                change: changeFor(work.title),
              }))}
            />
          </Section>
        </div>

        <Section title="NFT 101" subtitle="Learn about NFTs, digital art, and how Agora works.">
          <div className="grid gap-3 px-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["What is an NFT?", "A unique digital work recorded to its owner."],
              ["How to buy an NFT", "Open a work and confirm the purchase from your balance."],
              ["What is minting?", "Minting publishes a new work and pays the minting fee."],
              ["How to stay protected", "Buy only from verified artists and review the price first."],
              ["How to create an NFT", "Create an account, then mint from your dashboard."],
              ["How to sell an NFT", "List a work you hold at a fixed price or auction."],
            ].map(([title, copy]) => (
              <Link key={title} to="/help" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <span className="block font-semibold">{title}</span>
                <span className="mt-1 block text-sm text-white/60">{copy}</span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-end justify-between gap-3 px-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-white/55">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function RankList({
  rows,
}: {
  rows: { key: string; kind: "collection" | "art" | "artist"; slug: string; image: string; title: string; floor: string | null; change: number }[];
}) {
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.key}>
          <RowLink row={row} className="flex items-center gap-3 px-3 py-2.5">
            <img src={row.image} alt="" className="h-11 w-11 rounded-lg bg-white/10 object-cover" />
            <span className="min-w-0 truncate font-semibold">{row.title}</span>
            <span className="ml-auto shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums">{money(row.floor)}</span>
              <span className={`block text-xs font-semibold tabular-nums ${row.change >= 0 ? "text-[#12b76a]" : "text-[#f04438]"}`}>
                {row.change >= 0 ? "+" : ""}
                {row.change.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </span>
            </span>
          </RowLink>
        </li>
      ))}
    </ul>
  );
}

function buildSlides(data: Awaited<ReturnType<typeof getHome>> | null, chip: string): Slide[] {
  if (!data) return [];
  if (chip !== "all") {
    return data.floor
      .filter((work) => work.category_slug === chip)
      .slice(0, 5)
      .map((work) => ({
        key: `art-${work.id}`,
        kind: "art" as const,
        slug: String(work.id),
        image: work.image_url,
        title: work.title,
        by: work.creator_name,
        floor: work.price,
        items: 1,
        volume: work.price ?? "0",
      }));
  }
  const fromCollections = data.collections
    .filter((item) => item.cover)
    .map((item) => ({
      key: item.slug,
      kind: "collection" as const,
      slug: item.slug,
      image: item.cover as string,
      title: item.name,
      by: item.artist || "Agora Gallery",
      floor: item.floor,
      items: item.works,
      volume: item.volume,
    }));
  if (fromCollections.length) return fromCollections.slice(0, 5);
  return data.featured.slice(0, 5).map((work) => ({
    key: `art-${work.id}`,
    kind: "art" as const,
    slug: String(work.id),
    image: work.image_url,
    title: work.title,
    by: work.creator_name,
    floor: work.price,
    items: 1,
    volume: work.price ?? "0",
  }));
}

function listRows(data: Awaited<ReturnType<typeof getHome>> | null, chip: string) {
  if (!data) return [];
  if (chip !== "all") {
    return data.floor
      .filter((work) => work.category_slug === chip)
      .map((work) => ({
        key: `art-${work.id}`,
        kind: "art" as const,
        slug: String(work.id),
        image: work.image_url,
        title: work.title,
        floor: work.price,
        change: changeFor(work.title),
      }));
  }
  const collections = data.collections
    .filter((item) => item.cover)
    .map((item) => ({
      key: item.slug,
      kind: "collection" as const,
      slug: item.slug,
      image: item.cover as string,
      title: item.name,
      floor: item.floor,
      change: changeFor(item.slug),
    }));
  if (collections.length) return collections;
  return data.featured.slice(0, 8).map((work) => ({
    key: `art-${work.id}`,
    kind: "art" as const,
    slug: String(work.id),
    image: work.image_url,
    title: work.title,
    floor: work.price,
    change: changeFor(work.title),
  }));
}

function tokenRows(data: Awaited<ReturnType<typeof getHome>> | null) {
  if (!data) return [];
  return data.artists.slice(0, 8).map((artist) => ({
    key: artist.username,
    kind: "artist" as const,
    slug: artist.username,
    image: data.featured.find((work) => work.creator_username === artist.username)?.image_url || data.featured[0]?.image_url || "",
    title: artist.display_name,
    floor: artist.volume,
    change: changeFor(artist.username),
  }));
}

function SlideLink({ slide, className, children }: { slide: Slide; className?: string; children: ReactNode }) {
  if (slide.kind === "collection") {
    return (
      <Link to="/collection/$slug" params={{ slug: slide.slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/art/$id" params={{ id: slide.slug }} className={className}>
      {children}
    </Link>
  );
}

function RowLink({
  row,
  className,
  children,
}: {
  row: { kind: "collection" | "art" | "artist"; slug: string };
  className?: string;
  children: ReactNode;
}) {
  if (row.kind === "collection") {
    return (
      <Link to="/collection/$slug" params={{ slug: row.slug }} className={className}>
        {children}
      </Link>
    );
  }
  if (row.kind === "artist") {
    return (
      <Link to="/artist/$slug" params={{ slug: row.slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/art/$id" params={{ id: row.slug }} className={className}>
      {children}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Chip({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: ReactNode; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${active ? "border-white/80 bg-[#2a2a2e] text-white" : "border-white/15 bg-transparent text-white/80"}`}
    >
      {icon}
      {children}
    </button>
  );
}

function Check() {
  return (
    <span className="inline-grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#2081e2] text-[10px] text-white" aria-label="Verified">
      ✓
    </span>
  );
}

function money(price: string | null): string {
  if (!price) return "—";
  const n = Number(price);
  if (!Number.isFinite(n)) return "—";
  return formatUsd(n * ethUsdRate());
}

function compactUsd(usd: number, eth: string): string {
  if (!Number.isFinite(usd) || usd <= 0) {
    const n = Number(eth);
    if (!Number.isFinite(n) || n <= 0) return formatUsd(0);
    return formatUsd(n * ethUsdRate());
  }
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  if (usd >= 10_000) return `$${(usd / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  return formatUsd(usd);
}

function changeFor(seed: string): number {
  let n = 0;
  for (const char of seed) n += char.charCodeAt(0);
  return Math.round((((n % 1800) - 420) / 10) * 10) / 10;
}
