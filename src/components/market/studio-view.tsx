import { Link } from "@tanstack/react-router";
import { BackButton } from "./back-button";
import { ChevronDown, Eye, EyeOff, Gem, LayoutGrid, List, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Card } from "@/lib/market.functions";
import { ethUsdRate, formatUsd, formatWhen, shortAddr } from "@/lib/format";

export type StudioTab = "overview" | "holdings" | "trades" | "activity" | "orders" | "watch" | "profile";

type Trade = { id: number; title: string | null; artwork_id: number | null; price: string; kind: string; at: string };
type OfferIn = { id: number; artwork_id: number; title: string; amount: string; bidder_name: string };
type OfferOut = { id: number; artwork_id: number; title: string; amount: string; status: string };
type ActivityRow = { id: number; kind: string; detail: string; at: string };

export function StudioView({
  name,
  username,
  avatarUrl,
  joined,
  wallets,
  balanceEth,
  unit,
  setUnit,
  hideValue,
  setHideValue,
  tab,
  setTab,
  menu,
  setMenu,
  more,
  setMore,
  walletsOpen,
  setWalletsOpen,
  searchOpen,
  setSearchOpen,
  query,
  setQuery,
  hits,
  onSearch,
  assetQuery,
  setAssetQuery,
  sort,
  setSort,
  layout,
  setLayout,
  works,
  trades,
  activity,
  offersIn,
  offersOut,
  onAccept,
  onDecline,
  onWithdraw,
  onTheme,
  theme,
  onSignOut,
  profile,
}: {
  name: string;
  username: string;
  avatarUrl: string | null;
  joined: string;
  wallets: { label: string; address: string }[];
  balanceEth: number;
  unit: "usd" | "eth";
  setUnit: (unit: "usd" | "eth") => void;
  hideValue: boolean;
  setHideValue: (value: boolean) => void;
  tab: StudioTab;
  setTab: (tab: StudioTab) => void;
  menu: boolean;
  setMenu: (value: boolean) => void;
  more: boolean;
  setMore: (value: boolean) => void;
  walletsOpen: boolean;
  setWalletsOpen: (value: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
  query: string;
  setQuery: (value: string) => void;
  hits: { username: string; display_name: string; city: string; works: number }[];
  onSearch: () => void;
  assetQuery: string;
  setAssetQuery: (value: string) => void;
  sort: "recent" | "value" | "name";
  setSort: (value: "recent" | "value" | "name") => void;
  layout: "list" | "grid";
  setLayout: (value: "list" | "grid") => void;
  works: Card[];
  trades: Trade[];
  activity: ActivityRow[];
  offersIn: OfferIn[];
  offersOut: OfferOut[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onWithdraw: (id: number) => void;
  onTheme: (mode: "light" | "dark") => void;
  theme: "light" | "dark";
  onSignOut: () => void;
  profile: ReactNode;
}) {
  const tabs: { id: StudioTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "holdings", label: "Holdings" },
    { id: "trades", label: "Trades" },
    { id: "activity", label: "Activity" },
    { id: "orders", label: "Orders" },
    { id: "watch", label: "Watchlist" },
  ];
  const shown = hideValue ? "••••" : money(balanceEth, unit);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div className="desk min-h-screen bg-[#0d0d0f] pb-24 text-white md:grid md:grid-cols-[13rem_1fr] md:pb-8">
      <aside className="hidden border-r border-white/10 p-4 md:block">
        <p className="px-3 py-2 text-lg font-extrabold">Agora</p>
        <nav className="mt-2 grid gap-1 text-sm">
          {tabs.map((item) => (
            <button key={item.id} type="button" className={`rounded-xl px-3 py-2 text-left ${tab === item.id ? "bg-white text-black" : "hover:bg-white/5"}`} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
          <Link to="/explore" search={{ q: "", category: "", kind: "", min: "", max: "", sort: "newest", artist: "" }} className="rounded-xl px-3 py-2 hover:bg-white/5">Explore</Link>
          <Link to="/mint" className="rounded-xl px-3 py-2 hover:bg-white/5">Mint</Link>
          <Link to="/deposit" className="rounded-xl px-3 py-2 hover:bg-white/5">Deposit</Link>
          <Link to="/withdraw" className="rounded-xl px-3 py-2 hover:bg-white/5">Withdraw</Link>
        </nav>
      </aside>
      <div className="min-w-0">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-1 bg-[#0d0d0f]/95 px-2 pt-[env(safe-area-inset-top)]">
        <button type="button" className="grid h-11 w-11 place-items-center md:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
          <Menu size={22} />
        </button>
        <p className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2081e2] text-sm">A</span>
          Agora
        </p>
        <div className="relative ml-auto">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#2aab9b] text-sm font-bold"
            aria-label="Account menu"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((value) => !value)}
          >
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : name.charAt(0)}
          </button>
          {accountOpen ? (
            <div className="absolute right-0 z-40 mt-2 w-52 rounded-2xl border border-white/10 bg-[#16181d] p-2 text-sm shadow-xl">
              <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5" onClick={() => { setTab("profile"); setAccountOpen(false); }}>Edit profile</button>
              <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5" onClick={() => { setTab("activity"); setAccountOpen(false); }}>Account Activity</button>
              <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/5" onClick={onSignOut}>Sign out</button>
            </div>
          ) : null}
        </div>
      </header>
      {tab !== "overview" ? <div className="px-3"><BackButton /></div> : null}

      {searchOpen ? (
        <form
          className="px-4 pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collectors" />
          {hits.length > 0 ? (
            <ul className="mt-2 overflow-hidden rounded-2xl border border-white/10">
              {hits.map((hit) => (
                <li key={hit.username}>
                  <Link to="/artist/$slug" params={{ slug: hit.username }} className="block px-4 py-3 text-sm hover:bg-white/5">
                    {hit.display_name} <span className="text-white/50">@{hit.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
      ) : null}

      <section className="bg-[radial-gradient(120%_80%_at_50%_0%,#12343c_0%,#0d0d0f_68%)] px-4 pb-2 pt-4">
        <div className="flex items-start justify-between">
          <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[#2aab9b] text-3xl font-bold ring-4 ring-[#0d0d0f]">
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : name.charAt(0)}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{name}</h1>
        <button type="button" className="mt-1 flex items-center gap-1 text-sm text-white/60" onClick={() => setWalletsOpen(!walletsOpen)}>
          {wallets.length} {wallets.length === 1 ? "wallet" : "wallets"} <ChevronDown size={14} />
        </button>
        {walletsOpen ? (
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {wallets.map((wallet) => (
              <li key={wallet.label}>{wallet.label}: {shortAddr(wallet.address)}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 text-sm text-white/70">
          <span className="font-semibold text-white">0</span> Following
          <span className="px-1">·</span>
          <span className="font-semibold text-white">0</span> Followers
          <span className="px-1">·</span>
          Joined {joined}
        </p>
        <p className="mt-1 text-xs text-white/40">@{username}</p>
      </section>

      <div className="sticky top-14 z-20 border-b border-white/10 bg-[#0d0d0f]">
        <div className="flex gap-5 overflow-x-auto px-4">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`shrink-0 border-b-2 py-3 text-sm font-semibold ${tab === item.id ? "border-white text-white" : "border-transparent text-white/50"}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" ? <div className="px-4 py-6">{profile}</div> : null}

      {tab !== "profile" ? (
        <div className="px-4 pt-5">
          <p className="flex items-center gap-2 text-sm text-white/60">
            Available balance
            <button type="button" aria-label={hideValue ? "Show value" : "Hide value"} onClick={() => setHideValue(!hideValue)}>
              {hideValue ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight">{shown}</p>
        </div>
      ) : null}

      {tab === "overview" ? (
        <section className="mt-6 px-4">
          <h2 className="text-sm font-semibold text-white/60">Recent activity</h2>
          <ActivityRows rows={activity.slice(0, 6)} />
        </section>
      ) : null}

      {tab === "holdings" || tab === "watch" ? (
        <section className="mt-5">
          <div className="flex items-center gap-2 px-4">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm text-white/70">
              <Search size={16} />
              <input className="w-full bg-transparent outline-none placeholder:text-white/40" value={assetQuery} onChange={(event) => setAssetQuery(event.target.value)} placeholder="Search" />
            </label>
            <label className="rounded-full border border-white/15 px-3 py-2 text-sm">
              <span className="sr-only">Sort</span>
              <select className="bg-transparent outline-none" value={sort} onChange={(event) => setSort(event.target.value as "recent" | "value" | "name")}>
                <option value="recent">Recently received</option>
                <option value="value">Highest value</option>
                <option value="name">Name</option>
              </select>
            </label>
            <button type="button" className={`grid h-10 w-10 place-items-center rounded-xl border border-white/15 ${layout === "grid" ? "bg-white text-black" : ""}`} aria-label="Grid" onClick={() => setLayout("grid")}>
              <LayoutGrid size={16} />
            </button>
            <button type="button" className={`grid h-10 w-10 place-items-center rounded-xl border border-white/15 ${layout === "list" ? "bg-white text-black" : ""}`} aria-label="List" onClick={() => setLayout("list")}>
              <List size={16} />
            </button>
          </div>
          {layout === "list" ? (
            <div className="mt-4">
              <div className="flex px-4 pb-2 text-xs tracking-wide text-white/40">
                <span className="flex-1">ASSET</span>
                <span>VALUE</span>
              </div>
              {works.length === 0 ? <p className="px-4 py-8 text-sm text-white/50">No {tab === "watch" ? "saved works" : "holdings"} yet.</p> : null}
              <ul>
                {works.map((work) => (
                  <li key={work.id} className="border-t border-white/10">
                    <Link to="/art/$id" params={{ id: String(work.id) }} className="flex items-center gap-3 px-4 py-3">
                      <img src={work.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{work.title}</span>
                        <span className="block truncate text-xs text-white/45">{work.category_slug}</span>
                      </span>
                      <span className="text-sm tabular-nums">{work.price ? money(Number(work.price), unit) : "—"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 px-4">
              {works.map((work) => (
                <Link key={work.id} to="/art/$id" params={{ id: String(work.id) }} className="overflow-hidden rounded-2xl bg-[#16181d]">
                  <img src={work.image_url} alt="" className="aspect-square w-full object-cover" />
                  <span className="block px-3 py-2 text-sm font-semibold">{work.title}</span>
                  <span className="block px-3 pb-3 text-xs text-white/50">{work.price ? money(Number(work.price), unit) : "Unlisted"}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === "trades" ? (
        <ul className="mt-4">
          {trades.length === 0 ? <li className="px-4 py-8 text-sm text-white/50">No trades yet.</li> : null}
          {trades.map((trade) => (
            <li key={`${trade.kind}-${trade.id}`} className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm">
              <span>
                <span className="block font-semibold">{trade.title || trade.kind}</span>
                <span className="text-xs text-white/45">{formatWhen(trade.at)}</span>
              </span>
              <span className="tabular-nums">{money(Number(trade.price), unit)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "activity" ? (
        <div className="mt-2">
          <ActivityRows rows={activity} />
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="mt-4 space-y-6 px-4">
          <section>
            <h2 className="text-sm font-semibold text-white/60">Incoming</h2>
            <ul className="mt-2 space-y-2">
              {offersIn.length === 0 ? <li className="text-sm text-white/50">No incoming offers.</li> : null}
              {offersIn.map((offer) => (
                <li key={offer.id} className="rounded-2xl border border-white/10 p-3 text-sm">
                  <p>{offer.bidder_name} offered {money(Number(offer.amount), unit)} on {offer.title}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-full bg-[#2081e2] px-4 py-2 text-sm font-semibold" onClick={() => onAccept(offer.id)}>Accept</button>
                    <button type="button" className="rounded-full border border-white/20 px-4 py-2 text-sm" onClick={() => onDecline(offer.id)}>Decline</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-white/60">Your offers</h2>
            <ul className="mt-2 space-y-2">
              {offersOut.length === 0 ? <li className="text-sm text-white/50">No open offers.</li> : null}
              {offersOut.map((offer) => (
                <li key={offer.id} className="rounded-2xl border border-white/10 p-3 text-sm">
                  <Link to="/art/$id" params={{ id: String(offer.artwork_id) }} className="font-semibold">{offer.title}</Link>
                  <p className="mt-1 tabular-nums">{money(Number(offer.amount), unit)}</p>
                  <button type="button" className="mt-3 rounded-full border border-white/20 px-4 py-2 text-sm" onClick={() => onWithdraw(offer.id)}>Withdraw</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/10 bg-[#0d0d0f] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="flex items-center gap-2 text-sm font-semibold tabular-nums">
          <Gem size={16} className="text-white/70" />
          {hideValue ? "••••" : money(balanceEth, unit)}
        </p>
        <div className="flex items-center gap-1 text-white/50">
          <button type="button" aria-label="Light" className={theme === "light" ? "text-white" : ""} onClick={() => onTheme("light")}><Sun size={16} /></button>
          <button type="button" aria-label="Dark" className={theme === "dark" ? "text-white" : ""} onClick={() => onTheme("dark")}><Moon size={16} /></button>
        </div>
        <div className="flex rounded-full bg-white/10 p-0.5 text-xs font-semibold">
          <button type="button" className={`rounded-full px-3 py-1 ${unit === "eth" ? "bg-white text-black" : "text-white/70"}`} onClick={() => setUnit("eth")}>Crypto</button>
          <button type="button" className={`rounded-full px-3 py-1 ${unit === "usd" ? "bg-white text-black" : "text-white/70"}`} onClick={() => setUnit("usd")}>USD</button>
        </div>
      </div>

      {menu ? (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setMenu(false)}>
          <div className="h-full w-72 bg-[#111214] p-4" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-bold">Agora</p>
              <button type="button" aria-label="Close menu" onClick={() => setMenu(false)}><X size={20} /></button>
            </div>
            <nav className="mt-6 grid gap-1 text-sm">
              {tabs.map((item) => (
                <button key={item.id} type="button" className="rounded-xl px-3 py-3 text-left hover:bg-white/5" onClick={() => { setTab(item.id); setMenu(false); }}>{item.label}</button>
              ))}
              <Link to="/explore" search={{ q: "", category: "", kind: "", min: "", max: "", sort: "newest", artist: "" }} className="rounded-xl px-3 py-3 hover:bg-white/5" onClick={() => setMenu(false)}>Explore</Link>
              <Link to="/mint" className="rounded-xl px-3 py-3 hover:bg-white/5">Mint</Link>
              <Link to="/deposit" className="rounded-xl px-3 py-3 hover:bg-white/5">Deposit</Link>
              <Link to="/withdraw" className="rounded-xl px-3 py-3 hover:bg-white/5">Withdraw</Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
    </div>
  );
}

function money(eth: number, unit: "usd" | "eth") {
  if (!Number.isFinite(eth)) return "—";
  if (unit === "usd") return formatUsd(eth * ethUsdRate());
  return `${eth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH`;
}

function ActivityRows({ rows }: { rows: ActivityRow[] }) {
  if (rows.length === 0) return <p className="px-4 py-6 text-sm text-white/50">No activity yet.</p>;
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.id} className="flex items-start justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm">
          <span><span className="capitalize">{row.kind.replaceAll("_", " ")}</span> · {row.detail}</span>
          <span className="shrink-0 text-xs text-white/40">{formatWhen(row.at)}</span>
        </li>
      ))}
    </ul>
  );
}
