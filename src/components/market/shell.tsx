import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SignedIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { displayZones, ethUsdRate, formatUsd } from "@/lib/format";
import { useMarket } from "./provider";
import { getHome } from "@/lib/market.functions";
import { SessionWatch } from "./session-watch";
import { BackButton } from "./back-button";

const floor = { q: "", category: "", kind: "", min: "", max: "", sort: "newest" as const, artist: "" };

export function Shell({ children }: { children: ReactNode }) {
  const { me, timeZone, setTimeZone } = useMarket();
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    getHome().then((data) => setBanner(data.announcement || "")).catch(() => undefined);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  function search(event: FormEvent) {
    event.preventDefault();
    setMenu(false);
    void navigate({ to: "/explore", search: { ...floor, q } });
  }

  const desk = pathname.startsWith("/admin");
  if (desk) {
    return <div className="min-h-screen bg-[#f4f6f8] text-[#111827]">{children}</div>;
  }

  const letter = (me?.profile.display_name || "A").charAt(0).toUpperCase();
  const home = pathname === "/";
  const studio = pathname === "/dashboard";
  const showPublic = !studio && !user;
  const bar = home ? "border-white/15 bg-[#16181d] text-white" : "border-line bg-bg text-fg";

  return (
    <div className={home || studio ? "min-h-screen bg-[#0d0d0f] text-white" : "min-h-screen bg-bg text-fg"}>
      {showPublic ? (
      <header className={`sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] ${bar}`}>
        <div className={`mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 md:hidden ${home ? "text-white" : ""}`}>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu((value) => !value)}
          >
            {menu ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
          <Link to="/" className="flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white">A</span>
            Agora
          </Link>
          {user ? (
            <>
              <button
                type="button"
                className="ml-auto grid h-11 w-11 place-items-center"
                aria-label="Search"
                onClick={() => setMenu(true)}
              >
                <Search size={20} aria-hidden />
              </button>
              <AccountButton letter={letter} name={me?.profile.display_name} open={account} setOpen={setAccount} />
            </>
          ) : (
            <div className="ml-auto flex items-center gap-1">
              <Link to="/login" search={{ mode: "in" }} className="px-2 text-sm font-semibold">Sign in</Link>
              <Link to="/create-account" className="rounded-full bg-accent px-3 py-2 text-xs font-bold text-white">Create account</Link>
            </div>
          )}
        </div>
        <div className="mx-auto hidden h-16 max-w-6xl items-center gap-3 px-4 md:flex">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white">A</span>
            <span className={home ? "text-white" : "text-fg"}>Agora Gallery NFTs</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/explore" search={floor} active={pathname === "/explore"} onDark={home}>Explore</NavLink>
            <NavLink to="/artists" active={pathname.startsWith("/artist")} onDark={home}>Artists</NavLink>
          </nav>
          <form onSubmit={search} className="ml-auto w-64">
            <SearchField q={q} setQ={setQ} onDark={home} />
          </form>
          {user ? (
            <AccountButton letter={letter} name={me?.profile.display_name} open={account} setOpen={setAccount} />
          ) : (
            <>
              <Link to="/login" search={{ mode: "in" }} className={home ? "rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white" : "btn-ghost px-3 text-sm"}>Sign in</Link>
              <Link to="/create-account" className="btn px-4 text-sm">Create account</Link>
            </>
          )}
        </div>
      </header>
      ) : null}
      {menu && !studio
        ? createPortal(
            <div className={`fixed inset-0 z-[80] flex h-dvh flex-col pt-[env(safe-area-inset-top)] md:hidden ${home ? "bg-[#0d0d0f] text-white" : "bg-bg text-fg"}`}>
              <div className="flex h-16 items-center justify-between border-b border-line px-4">
                <p className="text-base font-extrabold">Agora Gallery NFTs</p>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface"
                  aria-label="Close menu"
                  onClick={() => setMenu(false)}
                >
                  <X size={20} aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <form onSubmit={search}>
                  <SearchField q={q} setQ={setQ} />
                </form>
                <nav className="mt-4 grid gap-1">
                  <NavLink to="/explore" search={floor} active={pathname === "/explore"}>Explore</NavLink>
                  <NavLink to="/artists" active={pathname.startsWith("/artist")}>Artists</NavLink>
                </nav>
                <div className="mt-6 grid gap-2">
                  <SignedIn>
                    <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                    <button type="button" className="btn-ghost" onClick={() => void signOut("/")}>Sign out</button>
                  </SignedIn>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      <main>
        {banner && !pathname.startsWith("/admin") ? <p className="bg-[#2563eb] px-4 py-2 text-center text-sm text-white">{banner}</p> : null}
        {pathname !== "/" && !studio ? (
          <div className="mx-auto max-w-6xl px-3 pt-2">
            <BackButton />
          </div>
        ) : null}
        {children}
      </main>
      {studio ? null : <Footer timeZone={timeZone} setTimeZone={setTimeZone} dark={home} />}
      <CookieNotice lift={studio} />
      <SessionWatch />
    </div>
  );
}

function SearchField({ q, setQ, onDark = false }: { q: string; setQ: (value: string) => void; onDark?: boolean }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search artworks</span>
      <Search size={16} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${onDark ? "text-white/60" : "text-muted"}`} aria-hidden />
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search artworks"
        className={`field pl-9 ${onDark ? "border-white/20 bg-white/10 text-white placeholder:text-white/50" : "bg-surface"}`}
      />
    </label>
  );
}

function NavLink({
  to,
  search,
  active,
  onDark = false,
  children,
}: {
  to: "/explore" | "/artists";
  search?: typeof floor;
  active: boolean;
  onDark?: boolean;
  children: string;
}) {
  const className = `rounded-xl px-3 py-3 text-base font-semibold md:py-2 md:text-sm ${active ? "bg-accent text-white" : onDark ? "text-white" : "text-fg"}`;
  if (search) {
    return (
      <Link to={to} search={search} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

function AccountButton({
  letter,
  name,
  open,
  setOpen,
}: {
  letter: string;
  name?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full bg-accent text-sm font-bold text-white"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {letter}
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 text-fg shadow-[var(--shadow)]">
          <p className="px-3 py-2 text-sm font-semibold">{name}</p>
          <Link to="/dashboard" className="block rounded-xl px-3 py-2 text-sm hover:bg-raised" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-raised" onClick={() => void signOut("/")}>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Footer({ timeZone, setTimeZone, dark }: { timeZone: string; setTimeZone: (zone: string) => void; dark?: boolean }) {
  return (
    <footer className={dark ? "mt-8 border-t border-white/10 bg-[#0d0d0f] text-white" : "mt-16 border-t border-line bg-bg"}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-extrabold">Agora Gallery NFTs</p>
          <p className="mt-2 text-sm text-muted">A marketplace for original digital art. Prices are shown in ETH with an estimated US dollar value.</p>
          <p className="mt-3 text-sm text-muted">Reference rate: 1 ETH ≈ {formatUsd(ethUsdRate())}. This is not a live quote.</p>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link to="/legal/$page" params={{ page: "terms" }}>Terms of Service</Link>
          <Link to="/legal/$page" params={{ page: "privacy" }}>Privacy Policy</Link>
          <Link to="/legal/$page" params={{ page: "cookies" }}>Cookie Policy</Link>
          <Link to="/legal/$page" params={{ page: "fees" }}>Fees and Royalties</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Support</p>
          <Link to="/help">Help Center</Link>
          <Link to="/contact">Contact Us</Link>
          <a href="mailto:support@agoragallery.com">support@agoragallery.com</a>
          <a href="https://x.com" rel="noreferrer">X</a>
          <a href="https://www.instagram.com" rel="noreferrer">Instagram</a>
        </div>
        <label className="text-sm">
          <span className="font-semibold">Time zone</span>
          <select className="field mt-2" value={timeZone} onChange={(event) => setTimeZone(event.target.value)} aria-label="Time zone">
            {displayZones().map((zone) => (
              <option key={zone} value={zone}>{zone.replace("America/", "").replace("Pacific/", "").replaceAll("_", " ")}</option>
            ))}
          </select>
          <p className="mt-2 text-muted">Times use a 12-hour clock. The default is US Eastern.</p>
        </label>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted">© 2026 Agora Gallery NFTs. All rights reserved.</p>
      </div>
    </footer>
  );
}

function CookieNotice({ lift = false }: { lift?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setOpen(window.localStorage.getItem("agora-cookies") !== "accepted");
    } catch {
      setOpen(true);
    }
  }, []);
  if (!open) return null;
  return (
    <div className={`fixed inset-x-0 z-50 border-t border-line bg-surface p-4 text-sm shadow-[var(--shadow)] ${lift ? "bottom-16" : "bottom-0"}`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-muted">
          We use necessary cookies to keep you signed in. See the <Link to="/legal/$page" params={{ page: "cookies" }} className="text-accent">Cookie Policy</Link>.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            try {
              window.localStorage.setItem("agora-cookies", "accepted");
            } catch {
              /* ignore */
            }
            setOpen(false);
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
